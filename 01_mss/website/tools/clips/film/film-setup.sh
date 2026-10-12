#!/usr/bin/env bash
# Rebuild the filming database for the v6 console and campaign clips.
# studio_film_sandbox = a fresh copy of the shared sandbox (studio_sandbox), so filming
# never touches another session's data. Then, off camera: sign in, give the filmed Vera
# emails real copy through the console, and set the approver to Vera's fictional owner.
#   SERVER_DIR=<worktree>/service bash film/film-setup.sh
# SERVER_DIR's .env.sandbox must name studio_film_sandbox and PORT=3451. The script stops the
# server on :3451 only if it runs from SERVER_DIR, copies the database, then starts it again
# (worker on: its email goes to SERVER_DIR/outbox-sandbox as files, never sent).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SVC=/Users/osmanakhtar/workspace/studio-platform/service
STATE=${STATE:-/tmp/mss-film-console-state.json}
SERVER_DIR=${SERVER_DIR:?set SERVER_DIR to the worktree service folder}
grep -q '/studio_film_sandbox' "$SERVER_DIR/.env.sandbox" || { echo "$SERVER_DIR/.env.sandbox does not name studio_film_sandbox"; exit 1; }
PID=$(lsof -tiTCP:3451 -sTCP:LISTEN || true)
if [ -n "$PID" ]; then
  [ "$(lsof -a -p "$PID" -d cwd -Fn | sed -n 's/^n//p')" = "$SERVER_DIR" ] || { echo "something else is on :3451 (pid $PID); not touching it"; exit 1; }
  kill "$PID"; sleep 1
fi
cd "$SVC"
psql_() { docker compose exec -T postgres psql -U platform -v ON_ERROR_STOP=1 -q "$@"; }
echo "== copy studio_sandbox -> studio_film_sandbox"
psql_ -d postgres -c "drop database if exists studio_film_sandbox with (force)" -c "create database studio_film_sandbox owner sandbox_owner"
docker compose exec -T postgres sh -c 'pg_dump -U platform --no-owner studio_sandbox | psql -U sandbox_owner -v ON_ERROR_STOP=1 -q -d studio_film_sandbox'
echo "== start the filming server"
(cd "$SERVER_DIR" && WORKER_IN_PROCESS=1 nohup npx tsx --env-file=.env.sandbox src/api/server.ts > /tmp/mss-film-server.log 2>&1 &)
for i in $(seq 1 30); do curl -s --max-time 2 -o /dev/null -f http://localhost:3451/console/vera/login && break; sleep 1; done
echo "== sign in off camera, write the filmed copy"
node "$HERE/console-auth.js" "$STATE"
node "$HERE/film-copy.js" "$STATE"
psql_ -d studio_film_sandbox <<'SQL'
with latest as (select distinct on (key) id from template_version where key ~ '^0[1-6]-' order by key, created_at desc)
update template_version t set subject = regexp_replace(subject, '^\[DRAFT\]\s*', ''), approved_by = 'Vera (clinic owner)' from latest where t.id = latest.id;
-- messages already sent store their subject at send time; clean the placeholder marker on film
update message set subject = regexp_replace(subject, '^\[DRAFT\]\s*', '') where subject like '[DRAFT]%';
update template_version set subject = regexp_replace(subject, '^\[DRAFT\]\s*', '') where subject like '[DRAFT]%';
SQL
echo "Done. Console session for the recorders: $STATE (delete it when finished)"
