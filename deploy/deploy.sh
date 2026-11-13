#!/usr/bin/env bash
set -euo pipefail

: "${PROJECT_ID:?Set PROJECT_ID to your GCP project ID}"
: "${DB_PASSWORD:?Set DB_PASSWORD without putting it in the repository or command history}"
: "${SEED_BORROWER_PASSWORD:?Set SEED_BORROWER_PASSWORD privately}"
: "${SEED_CUSTODIAN_PASSWORD:?Set SEED_CUSTODIAN_PASSWORD privately}"

REGION="${REGION:-asia-southeast1}"
SERVICE_NAME="${SERVICE_NAME:-inventory-borrowing}"
REGISTRY_NAME="${REGISTRY_NAME:-inventory}"
SQL_INSTANCE="${SQL_INSTANCE:-inventory-pg}"
DATABASE_NAME="${DATABASE_NAME:-inventory_db}"
DATABASE_USER="${DATABASE_USER:-inventory_user}"
RUNTIME_SERVICE_ACCOUNT="${RUNTIME_SERVICE_ACCOUNT:-inventory-runner}"
MIGRATE_JOB_NAME="${MIGRATE_JOB_NAME:-inventory-migrate}"
IMAGE_TAG="${IMAGE_TAG:-initial}"
DRY_RUN="${DRY_RUN:-1}"

run() {
  printf '+ '
  printf '%q ' "$@"
  printf '\n'
  if [[ "$DRY_RUN" != "1" ]]; then "$@"; fi
}

if [[ "$DRY_RUN" == "1" ]]; then
  echo "DRY RUN: no GCP resources will be changed. Set DRY_RUN=0 only after reviewing every command."
fi

run gcloud config set project "$PROJECT_ID"
run gcloud services enable run.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com
run gcloud artifacts repositories create "$REGISTRY_NAME" --repository-format=docker --location="$REGION" --description="Inventory application images"
run gcloud sql instances create "$SQL_INSTANCE" --database-version=POSTGRES_16 --edition=enterprise --tier=db-f1-micro --region="$REGION" --storage-size=10 --no-storage-auto-increase
run gcloud sql databases create "$DATABASE_NAME" --instance="$SQL_INSTANCE"
echo "+ gcloud sql users create $DATABASE_USER --instance=$SQL_INSTANCE --password=[redacted]"
if [[ "$DRY_RUN" != "1" ]]; then
  gcloud sql users create "$DATABASE_USER" --instance="$SQL_INSTANCE" --password="$DB_PASSWORD"
fi

CONNECTION_NAME="$PROJECT_ID:$REGION:$SQL_INSTANCE"
ENCODED_PASSWORD=$(printf '%s' "$DB_PASSWORD" | python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read(), safe=""))')
DATABASE_URL="postgresql://$DATABASE_USER:$ENCODED_PASSWORD@localhost/$DATABASE_NAME?host=/cloudsql/$CONNECTION_NAME"

if [[ "$DRY_RUN" != "1" ]]; then
  for secret in inventory-database-url inventory-borrower-password inventory-custodian-password; do
    gcloud secrets describe "$secret" >/dev/null 2>&1 || gcloud secrets create "$secret" --replication-policy=automatic
  done
  printf '%s' "$DATABASE_URL" | gcloud secrets versions add inventory-database-url --data-file=- >/dev/null
  printf '%s' "$SEED_BORROWER_PASSWORD" | gcloud secrets versions add inventory-borrower-password --data-file=- >/dev/null
  printf '%s' "$SEED_CUSTODIAN_PASSWORD" | gcloud secrets versions add inventory-custodian-password --data-file=- >/dev/null
else
  echo "+ create/update Secret Manager values through stdin (values hidden)"
fi

run gcloud iam service-accounts create "$RUNTIME_SERVICE_ACCOUNT" --display-name="Inventory runtime"
RUNTIME_EMAIL="$RUNTIME_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com"
run gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$RUNTIME_EMAIL" --role=roles/cloudsql.client
for secret in inventory-database-url inventory-borrower-password inventory-custodian-password; do
  run gcloud secrets add-iam-policy-binding "$secret" --member="serviceAccount:$RUNTIME_EMAIL" --role=roles/secretmanager.secretAccessor
done

IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_NAME/$SERVICE_NAME:$IMAGE_TAG"
run gcloud builds submit --tag "$IMAGE" .

run gcloud run jobs create "$MIGRATE_JOB_NAME" --image="$IMAGE" --region="$REGION" --service-account="$RUNTIME_EMAIL" --add-cloudsql-instances="$CONNECTION_NAME" --set-secrets=DATABASE_URL=inventory-database-url:latest,SEED_BORROWER_PASSWORD=inventory-borrower-password:latest,SEED_CUSTODIAN_PASSWORD=inventory-custodian-password:latest --set-env-vars=SEED_BORROWER_EMAIL=borrower@example.test,SEED_CUSTODIAN_EMAIL=custodian@example.test --command=sh --args=-c,"node server/node_modules/prisma/build/index.js migrate deploy --schema server/prisma/schema.prisma && node server/prisma/seed.js"
run gcloud run jobs execute "$MIGRATE_JOB_NAME" --region="$REGION" --wait
run gcloud run deploy "$SERVICE_NAME" --image="$IMAGE" --region="$REGION" --service-account="$RUNTIME_EMAIL" --add-cloudsql-instances="$CONNECTION_NAME" --set-secrets=DATABASE_URL=inventory-database-url:latest --set-env-vars=NODE_ENV=production,COOKIE_SECURE=true --allow-unauthenticated --min=0 --max=3 --port=3000

echo "Review the Cloud Run URL, then run: python3 deploy/smoke_test.py SERVICE_URL"
