#!/bin/bash
set -e;

# a default non-root role
MONGO_NON_ROOT_ROLE="${MONGO_NON_ROOT_ROLE:-readWrite}"

if [ -n "${MONGO_INITDB_APP_USERNAME:-}" ] && [ -n "${MONGO_INITDB_APP_PASSWORD:-}" ]; then
        "${mongo[@]}" "$MONGO_INITDB_DATABASE" <<-EOJS
                db.createUser({
                  user: $(_js_escape "$MONGO_INITDB_APP_USERNAME"),
                  pwd: $(_js_escape "$MONGO_INITDB_APP_PASSWORD"),
                  roles: [ { role: $(_js_escape "$MONGO_NON_ROOT_ROLE"), db: $(_js_escape "$MONGO_INITDB_DATABASE") } ]
                })
EOJS
else
  echo "UNABLE TO ADD USER"
fi