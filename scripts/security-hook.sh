#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# security-hook.sh — Wrapper para el hook PostToolUse de Claude Code
# Lee el JSON de stdin, extrae file_path y ejecuta security-check.sh
# Salida JSON: {"decision":"block","reason":"..."} si hay problemas
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT=$(cat)

FILE=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
")

# Solo actuar sobre archivos .ts
if [[ -z "$FILE" ]] || [[ "$FILE" != *.ts ]]; then
  exit 0
fi

OUTPUT=$("$SCRIPT_DIR/security-check.sh" "$FILE" 2>&1)
RC=$?

if [ $RC -ne 0 ]; then
  REASON=$(echo "$OUTPUT" | grep "▸" | sed 's/║  ▸ //' | head -3 | tr '"' "'" | tr '\n' ' | ')
  python3 -c "
import json, sys
msg = sys.argv[1]
print(json.dumps({'decision': 'block', 'reason': msg}))
" "🔴 Security check en $FILE — $REASON"
  exit 1
fi

exit 0
