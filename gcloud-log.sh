#!/bin/bash

echo "💬 Mostrando las ultimas 50 lineas del log..."

gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sangre-ai-backend" \
  --project=sangre-ai \
  --limit=50 \
  --format="value(textPayload)"