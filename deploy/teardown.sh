#!/usr/bin/env bash
set -euo pipefail

: "${PROJECT_ID:?Set PROJECT_ID}"
REGION="${REGION:-asia-southeast1}"

echo "This removes only the named Inventory lab resources from project $PROJECT_ID."
[[ "${CONFIRM_TEARDOWN:-}" == "$PROJECT_ID" ]] || {
  echo "Refusing. Set CONFIRM_TEARDOWN exactly to the project ID after grading ends."
  exit 1
}

gcloud run services delete inventory-borrowing --project "$PROJECT_ID" --region "$REGION" --quiet
gcloud run jobs delete inventory-migrate --project "$PROJECT_ID" --region "$REGION" --quiet
gcloud sql instances delete inventory-pg --project "$PROJECT_ID" --quiet
gcloud artifacts repositories delete inventory --project "$PROJECT_ID" --location "$REGION" --quiet

echo "Cloud Run, Cloud SQL and Artifact Registry resources were deleted. Review Secret Manager and IAM manually before deleting shared identities or secrets."
