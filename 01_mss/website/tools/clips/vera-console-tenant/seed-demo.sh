#!/bin/zsh
# Rebuilds the local Vera demo console from scratch: its own database
# (studio_platform_vera), outbox mail only, synthetic example.com sign-ups.
# Never touches the dev database (studio_platform) or production.
#
#   ./seed-demo.sh            rebuild DB, publish config, seed, leave server on :3402
#
# The capture limiter allows 10 submissions per IP per hour, in memory, so the
# server is restarted between batches of 10.
set -e
KIT=${0:A:h}
SVC=~/workspace/studio-platform/service
OUT=${OUTBOX_DIR:-/tmp/vera-outbox}
mkdir -p $OUT
cd $SVC
export DATABASE_URL=postgres://platform:platform@localhost:55433/studio_platform_vera
export DATABASE_URL_APP=$(grep '^DATABASE_URL_APP=' .env | cut -d= -f2- | sed 's#/studio_platform$#/studio_platform_vera#')
export PORT=3402 PUBLIC_BASE_URL=http://localhost:3402 MAIL_TRANSPORT=outbox OUTBOX_DIR=$OUT WORKER_IN_PROCESS=0

stop() { for p in $(lsof -tiTCP:3402 -sTCP:LISTEN 2>/dev/null); do kill $p; done; sleep 1; }
start() {
  stop
  (npx tsx --env-file=.env src/api/server.ts > $OUT/../vera-server.log 2>&1 &)
  for k in {1..40}; do curl -s localhost:3402/health >/dev/null && return; sleep 0.5; done
  echo "server did not start"; exit 1
}
post() { curl -s -o /dev/null -w "%{http_code} " -X POST localhost:3402/f/vera/$1 -H 'origin: http://localhost:4321' --data "$2"; }

stop
docker compose exec -T postgres psql -U platform -d postgres -qc "drop database if exists studio_platform_vera" -c "create database studio_platform_vera"
npm run -s migrate >/dev/null
npm run -s config:publish -- $KIT

names=(Amelia Grace Hannah Priya Sophie Leah Chloe Maya Zara Ella Rachel Holly Megan Aisha Jess Laura Nina Ruth Clare Fiona Emma Kate Sara Lucy Anna Beth)
start; for i in {1..10};  do post guide-opt-in "email=demo-$i@example.com&first_name=${names[$i]}&consent_marketing=yes&age_18=yes"; done
start; for i in {11..20}; do post guide-opt-in "email=demo-$i@example.com&first_name=${names[$i]}&consent_marketing=yes&age_18=yes"; done
start; for i in {21..26}; do post guide-opt-in "email=demo-$i@example.com&first_name=${names[$i]}&consent_marketing=yes&age_18=yes"; done
for j in {1..4}; do post consultation-request "email=demo-c$j@example.com&first_name=${names[$((j+4))]}"; done
start; for j in {5..7}; do post consultation-request "email=demo-c$j@example.com&first_name=${names[$((j+4))]}"; done
echo
npx tsx --env-file=.env src/cli/worker.ts --once
echo "Vera demo console: http://localhost:3402/console/vera/login (hello@vera-aesthetics.example)"
