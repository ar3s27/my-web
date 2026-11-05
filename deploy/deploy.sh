#!/usr/bin/env bash
# Siteyi ev sunucusuna yayınlar: kaynak kodu kopyalar, Docker imajını sunucuda derler,
# konteyneri yeniden başlatır.
#
# Kullanım (repo kökünden, Git Bash):   bash deploy/deploy.sh
set -euo pipefail

SERVER="${SERVER:-veysel@192.168.1.4}"
REMOTE_DIR="${REMOTE_DIR:-apps/veyselerkoyuncu-3d}"

cd "$(dirname "$0")/.."

echo ">> Kaynak kod gönderiliyor: $SERVER:~/$REMOTE_DIR/app"
ssh "$SERVER" "mkdir -p ~/$REMOTE_DIR && rm -rf ~/$REMOTE_DIR/app.new && mkdir ~/$REMOTE_DIR/app.new"
tar --exclude=./.git --exclude=./.claude --exclude=./node_modules --exclude=./dist \
    --exclude='./.env*' -czf - . \
  | ssh "$SERVER" "tar -xzf - -C ~/$REMOTE_DIR/app.new"

echo ">> Sunucuda derleniyor ve başlatılıyor"
ssh "$SERVER" bash -s -- "$REMOTE_DIR" <<'REMOTE'
set -euo pipefail
cd ~/"$1"
rm -rf app.old
[ -d app ] && mv app app.old
mv app.new app
cp app/deploy/compose.yaml compose.yaml

docker compose up -d --build
docker image prune -f >/dev/null
docker compose ps
REMOTE

echo ">> Tamam. Tünel adresi: http://veysel3d:80"
