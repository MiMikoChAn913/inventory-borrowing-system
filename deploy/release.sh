#!/usr/bin/env bash
set -euo pipefail

: "${PROJECT_ID:?PROJECT_ID is required}"
: "${REGION:?REGION is required}"
: "${SERVICE_NAME:?SERVICE_NAME is required}"
: "${MIGRATE_JOB_NAME:?MIGRATE_JOB_NAME is required}"
: "${REGISTRY_NAME:?REGISTRY_NAME is required}"
: "${IMAGE_TAG:?IMAGE_TAG is required}"

IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_NAME/$SERVICE_NAME:$IMAGE_TAG"
DIGEST=$(gcloud artifacts docker images describe "$IMAGE" --format='value(image_summary.digest)')
test -n "$DIGEST"
DEPLOYED_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_NAME/$SERVICE_NAME@$DIGEST"

gcloud run jobs update "$MIGRATE_JOB_NAME" \
  --project "$PROJECT_ID" --region "$REGION" --image "$DEPLOYED_IMAGE" --quiet

if [[ "${ROLLBACK:-false}" != "true" ]]; then
  gcloud run jobs execute "$MIGRATE_JOB_NAME" \
    --project "$PROJECT_ID" --region "$REGION" --wait --quiet
fi

gcloud run services update "$SERVICE_NAME" \
  --project "$PROJECT_ID" --region "$REGION" --image "$DEPLOYED_IMAGE" --quiet

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
  --project "$PROJECT_ID" --region "$REGION" --format='value(status.url)')
test -n "$SERVICE_URL"

if [[ -n "${GITHUB_ENV:-}" ]]; then
  printf 'DEPLOYED_IMAGE=%s\nSERVICE_URL=%s\n' "$DEPLOYED_IMAGE" "$SERVICE_URL" >> "$GITHUB_ENV"
fi

printf 'Deployed %s to %s\n' "$DEPLOYED_IMAGE" "$SERVICE_URL"
