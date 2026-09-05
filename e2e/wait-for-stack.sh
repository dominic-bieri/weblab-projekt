#!/bin/sh
# Wartet, bis Keycloak sein Realm importiert hat und das Frontend antwortet.
set -e

for i in $(seq 1 60); do
  if curl -sf http://localhost:8080/realms/daily-lens >/dev/null &&
    curl -sf http://localhost/ >/dev/null; then
    echo "Stack bereit nach ${i}s"
    exit 0
  fi
  sleep 1
done

echo "Stack nach 60s nicht bereit" >&2
exit 1
