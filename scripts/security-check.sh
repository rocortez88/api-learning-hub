#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# security-check.sh — Hook de seguridad para Claude Code
# Se ejecuta automáticamente en cada Write/Edit de archivos .ts
# Salida: 0 = OK, 1 = bloqueado con motivo
# ─────────────────────────────────────────────────────────────────────────────

FILE="$1"

# Solo aplica a archivos TypeScript dentro del proyecto
if [[ -z "$FILE" ]] || [[ "$FILE" != *.ts ]]; then
  exit 0
fi

ERRORS=()

# ── 1. Secretos hardcodeados ────────────────────────────────────────────────
if grep -qE "(password|secret|token|api_key|apikey)\s*=\s*['\"][^'\"]{4,}['\"]" "$FILE" 2>/dev/null; then
  ERRORS+=("SECRETO HARDCODEADO: valor literal asignado a variable sensible. Usa variables de entorno.")
fi

# ── 2. JWT_SECRET o DATABASE_URL literales ───────────────────────────────────
if grep -qE "JWT_SECRET\s*=\s*['\"].+['\"]|DATABASE_URL\s*=\s*['\"].+['\"]" "$FILE" 2>/dev/null; then
  ERRORS+=("SECRETO EN CODIGO: JWT_SECRET o DATABASE_URL con valor literal. Nunca en el codigo.")
fi

# ── 3. origin: '*' en CORS ──────────────────────────────────────────────────
if grep -qE "origin\s*:\s*['\*'\"]" "$FILE" 2>/dev/null; then
  ERRORS+=("CORS INSEGURO: origin:'*' detectado. Usa una lista explícita de dominios permitidos.")
fi

# ── 4. SQL injection — concatenación directa en queries ──────────────────────
if grep -qE "\$\{.*req\.(body|params|query)" "$FILE" 2>/dev/null; then
  ERRORS+=("SQL INJECTION: interpolación directa de req.body/params/query en template string. Usa Drizzle ORM siempre.")
fi

# ── 5. eval() o Function() con input externo ────────────────────────────────
if grep -qE "eval\(|new Function\(" "$FILE" 2>/dev/null; then
  ERRORS+=("CODE INJECTION: eval() o new Function() detectado. Prohibido en este proyecto.")
fi

# ── 6. console.log con datos sensibles ──────────────────────────────────────
if grep -qE "console\.(log|info|debug)\(.*password|console\.(log|info|debug)\(.*token|console\.(log|info|debug)\(.*secret" "$FILE" 2>/dev/null; then
  ERRORS+=("DATA LEAK: console.log con datos sensibles (password/token/secret). Elimina o usa logger seguro.")
fi

# ── 7. bcrypt rounds < 10 ────────────────────────────────────────────────────
if grep -qE "bcrypt(js)?\.hash\(.+,\s*[1-9]\s*\)" "$FILE" 2>/dev/null; then
  ERRORS+=("BCRYPT INSEGURO: menos de 10 rounds de bcrypt. Mínimo requerido: 12.")
fi

# ── 8. throw string literal (en lugar de AppError) ──────────────────────────
if grep -qE "throw\s+['\"]" "$FILE" 2>/dev/null; then
  ERRORS+=("ERROR TIPADO: throw con string literal. Usa AppError(statusCode, mensaje, code) siempre.")
fi

# ─────────────────────────────────────────────────────────────────────────────

if [ ${#ERRORS[@]} -gt 0 ]; then
  echo ""
  echo "╔══════════════════════════════════════════════════════════╗"
  echo "║  🔴  SECURITY HOOK — PROBLEMAS DETECTADOS               ║"
  echo "╠══════════════════════════════════════════════════════════╣"
  for err in "${ERRORS[@]}"; do
    echo "║  ▸ $err"
  done
  echo "║                                                          ║"
  echo "║  Archivo: $FILE"
  echo "╚══════════════════════════════════════════════════════════╝"
  echo ""
  exit 1
fi

echo "✅ Security check OK — $FILE"
exit 0
