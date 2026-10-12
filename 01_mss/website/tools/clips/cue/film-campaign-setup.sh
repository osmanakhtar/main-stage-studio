#!/usr/bin/env bash
# Filming setup for the Campaign cue film (capture-campaign.js). Local only: the filming
# database (studio_film_sandbox) and the console on :3451. Never app.puremed.uk.
#   1. ../film/film-setup.sh: fresh copy of the sandbox, server up, filmed email copy approved
#   2. migrate the copy up to the code (it can lag behind the sandbox it was copied from)
#   3. publish a filming copy of tenants/vera: test mode, Hannah on the allowlist, one day =
#      DAY_MS. The platform refuses day_ms in live mode; test mode is what makes it valid.
#   4. restart :3451 so the server reads the new config
#   SERVER_DIR=<studio-platform worktree>/service bash film-campaign-setup.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR=${SERVER_DIR:?set SERVER_DIR to the worktree service folder}
DAY_MS=${DAY_MS:-30000}
grep -q '/studio_film_sandbox' "$SERVER_DIR/.env.sandbox" || { echo "$SERVER_DIR/.env.sandbox does not name studio_film_sandbox"; exit 1; }

SERVER_DIR="$SERVER_DIR" bash "$HERE/../film/film-setup.sh" < /dev/null
(cd "$SERVER_DIR" && npm run -s sandbox:migrate | grep -v '^skip' || true)

KIT=$(mktemp -d)/vera
cp -R "$SERVER_DIR/../tenants/vera" "$KIT"
python3 - "$KIT/tenant.json" "$DAY_MS" <<'EOF'
import json, sys
p, day = sys.argv[1], int(sys.argv[2])
t = json.load(open(p))
t['sending']['mode'] = 'test'
t['sending']['test_allowlist'] = ['hannah.demo@example.com']
t['day_ms'] = day
json.dump(t, open(p, 'w'), indent=2)
EOF
(cd "$SERVER_DIR" && npx tsx --env-file=.env.sandbox src/cli/publish-config.ts "$KIT")

PID=$(lsof -tiTCP:3451 -sTCP:LISTEN || true)
if [ -n "$PID" ]; then
  [ "$(lsof -a -p "$PID" -d cwd -Fn | sed -n 's/^n//p')" = "$SERVER_DIR" ] || { echo "something else is on :3451 (pid $PID); not touching it"; exit 1; }
  kill "$PID"; sleep 2
fi
(cd "$SERVER_DIR" && WORKER_IN_PROCESS=1 nohup npx tsx --env-file=.env.sandbox src/api/server.ts > "$SERVER_DIR/.film-server.log" 2>&1 < /dev/null &)
for i in $(seq 1 30); do curl -s --max-time 2 -o /dev/null -f http://localhost:3451/console/vera/login && echo "filming console up (one day = ${DAY_MS}ms)" && exit 0; sleep 1; done
echo "the filming console did not come back up"; exit 1
