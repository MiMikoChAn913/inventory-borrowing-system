#!/usr/bin/env bash
# Lab 6 UAT data setup: create the second Borrower account (ACC-B2, "Demo Borrower 2").
#
# One-off and idempotent. It creates no app code changes and no new revision of the service:
# it runs the already-deployed image as a separate Cloud Run job that upserts one user.
# The password is random, lives only in Secret Manager, and is never printed here.
#
# Usage:  bash deploy/create-uat-borrower.sh
# Read the password to send privately to the UAT Team:
#   gcloud secrets versions access latest --secret inventory-borrower2-password --project inventory-borrow-cpe334
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-inventory-borrow-cpe334}"
REGION="${REGION:-asia-southeast1}"
SQL_INSTANCE="${SQL_INSTANCE:-inventory-pg}"
RUNNER_SA="inventory-runner@${PROJECT_ID}.iam.gserviceaccount.com"
SECRET="inventory-borrower2-password"
JOB="inventory-uat-setup"
UAT_EMAIL="${UAT_EMAIL:-borrower2@example.test}"
UAT_NAME="${UAT_NAME:-Demo Borrower 2}"

if ! gcloud secrets describe "$SECRET" --project "$PROJECT_ID" >/dev/null 2>&1; then
  head -c 64 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 20 |
    gcloud secrets create "$SECRET" --project "$PROJECT_ID" --replication-policy=automatic --data-file=-
fi
gcloud secrets add-iam-policy-binding "$SECRET" --project "$PROJECT_ID" \
  --member="serviceAccount:${RUNNER_SA}" --role=roles/secretmanager.secretAccessor --format=none

IMAGE="$(gcloud run jobs describe inventory-migrate --region "$REGION" --project "$PROJECT_ID" \
  --format='value(spec.template.spec.template.spec.containers[0].image)')"

SCRIPT='const bcrypt=require("bcryptjs");const {PrismaClient}=require("@prisma/client");
const p=new PrismaClient();const email=process.env.UAT_EMAIL.toLowerCase();const pw=process.env.UAT_PASSWORD;
if(!pw||pw.length<8)throw new Error("UAT_PASSWORD missing");
(async()=>{const u=await p.user.upsert({where:{email},update:{},create:{email,displayName:process.env.UAT_NAME,role:"BORROWER",passwordHash:await bcrypt.hash(pw,12)}});
console.log("UAT account ready:",u.email,u.role,u.displayName);})().finally(()=>p.$disconnect());'
SCRIPT="$(printf '%s' "$SCRIPT" | tr '\n' ' ')"

ACTION=create
gcloud run jobs describe "$JOB" --region "$REGION" --project "$PROJECT_ID" >/dev/null 2>&1 && ACTION=update

gcloud run jobs "$ACTION" "$JOB" --region "$REGION" --project "$PROJECT_ID" \
  --image "$IMAGE" --service-account "$RUNNER_SA" \
  --set-cloudsql-instances "${PROJECT_ID}:${REGION}:${SQL_INSTANCE}" \
  --set-secrets "DATABASE_URL=inventory-database-url:latest,UAT_PASSWORD=${SECRET}:latest" \
  --set-env-vars "^|^UAT_EMAIL=${UAT_EMAIL}|UAT_NAME=${UAT_NAME}" \
  --command sh --args="^#^-c#cd server && node -e '${SCRIPT}'" \
  --max-retries 0 --task-timeout 300

gcloud run jobs execute "$JOB" --region "$REGION" --project "$PROJECT_ID" --wait
echo "Done. Check the job logs for 'UAT account ready: ${UAT_EMAIL}'."
