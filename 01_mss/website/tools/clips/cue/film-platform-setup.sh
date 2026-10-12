#!/usr/bin/env bash
# Filming setup for the Platform cue film (capture-platform.js). Local only: studio_film_sandbox and :3451.
#   1. the Campaign filming setup, with Vera's own old-records DPIA questions (EXTRA_DP=1)
#   2. Vera Hale completes and signs the DPIA and accepts the DPA (vera-dp-sign.mts, the platform's own functions)
#   3. fictional old-system exports for Vera (gen-vera-legacy.py) in DATA, a folder outside the workspace
#      (the importer refuses bundles in workspace, Desktop, Documents or Dropbox)
#   4. the platform's people, written straight from the filming database (the export CLI only writes to
#      ~/puremed-data, which is for real data), then the real reconcile.py report and bundle
#   5. the real legacy importer, committed; its output kept as DATA/import-commit.txt for the film
#   SERVER_DIR=<studio-platform worktree>/service DATA=/tmp/vera-legacy bash film-platform-setup.sh
#   then: node capture-platform.js "$DATA" && node render-platform.js
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR=${SERVER_DIR:?set SERVER_DIR}; DATA=${DATA:?set DATA to a folder outside the workspace}
RECONCILE=/Users/osmanakhtar/workspace/main-stage-studio/02_clients/puremed/clinical-platform/tools/reconcile.py
EXTRA_DP=1 SERVER_DIR="$SERVER_DIR" bash "$HERE/film-campaign-setup.sh"
(cd "$SERVER_DIR" && npx tsx --env-file=.env.sandbox "$HERE/vera-dp-sign.mts")
rm -rf "$DATA"; python3 "$HERE/gen-vera-legacy.py" "$DATA"
(cd /Users/osmanakhtar/workspace/studio-platform/service && docker compose exec -T postgres psql -U platform -d studio_film_sandbox -c \
  "copy (select i.value as email, p.first_name, coalesce(p.last_name,'') as last_name from person p join person_identifier i on i.person_id=p.id and i.kind='email' join tenant t on t.id=p.tenant_id where t.slug='vera' and p.status='active') to stdout with csv header") > "$DATA/platform-people.csv"
python3 "$RECONCILE" --data "$DATA" --platform "$DATA/platform-people.csv"
R=$(ls -d "$DATA"/reconciliation-*)
python3 "$RECONCILE" --data "$DATA" --bundle "$R/review-queue.csv" --no-cut-off --platform "$DATA/platform-people.csv"
(cd "$SERVER_DIR" && npx tsx --env-file=.env.sandbox src/cli/import-legacy.ts --tenant vera --bundle "$R/import-bundle.json" --actor "Vera Hale (owner)" --commit) > "$DATA/import-commit.txt" 2>&1
head -1 "$DATA/import-commit.txt"
