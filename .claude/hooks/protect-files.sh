#!/usr/bin/env bash
# .claude/hooks/protect-files.sh
#
# PreToolUse hook: blocks Claude Code from reading/writing sensitive files
# or running bash commands that reference them.
#
# Exit codes:
#   0 = allow
#   2 = block (stderr is returned to Claude as feedback)
#
# Emergency override: set CLAUDE_PROTECT_DISABLE=1 in your shell.
# Do NOT commit that setting. Use only for one-off legitimate needs.

set -euo pipefail

# --- escape hatch ----------------------------------------------------------
if [[ "${CLAUDE_PROTECT_DISABLE:-0}" == "1" ]]; then
  exit 0
fi

# --- dependency check ------------------------------------------------------
if ! command -v jq >/dev/null 2>&1; then
  echo "protect-files: 'jq' is required. Install with 'brew install jq' or 'apt-get install jq'." >&2
  exit 2
fi

INPUT=$(cat)

# Collect every target: file paths from any tool + bash command string.
# Using readarray so paths with spaces survive intact.
TARGETS=()
while IFS= read -r line; do
  [[ -n "$line" ]] && TARGETS+=("$line")
done < <(echo "$INPUT" | jq -r '
  [
    .tool_input.file_path      // empty,
    .tool_input.path           // empty,
    .tool_input.notebook_path  // empty,
    .tool_input.command        // empty,
    (.tool_input.edits // [] | .[].file_path // empty)
  ] | map(select(. != "")) | .[]
')

[[ ${#TARGETS[@]} -eq 0 ]] && exit 0

# --- protected patterns (POSIX extended regex) -----------------------------
# Boundary classes:
#   BEFORE = start-of-string OR a non-identifier char (space, /, <, >, |, &, ;, =, ", ')
#   AFTER  = end-of-string  OR a non-identifier char
# This catches both filesystem paths and bash command substrings.
B='(^|[^[:alnum:]_-])'
A='($|[^[:alnum:]_-])'

PROTECTED=(
  # env files (all variants)
  "${B}\\.env${A}"
  "${B}\\.env\\.[^/]*${A}"

  # shell / auth dotfiles
  "${B}\\.netrc${A}"
  "${B}\\.pgpass${A}"
  "${B}\\.git-credentials${A}"

  # SSH
  "${B}\\.ssh/"
  "${B}id_(rsa|dsa|ecdsa|ed25519)${A}"

  # cloud credentials
  "${B}\\.aws/credentials${A}"
  "${B}\\.aws/config${A}"
  "${B}\\.azure/"
  "${B}\\.config/gcloud/"
  "${B}application_default_credentials\\.json${A}"
  "${B}\\.kube/config${A}"
  "${B}kubeconfig${A}"
  "${B}\\.docker/config\\.json${A}"

  # package managers
  "${B}\\.npmrc${A}"
  "${B}\\.pypirc${A}"
  "${B}\\.gem/credentials${A}"
  "${B}\\.cargo/credentials(\\.toml)?${A}"

  # generic secret dirs
  "${B}secrets?/"
  "${B}credentials?/"

  # certs & keystores (extension match — broad but intentional)
  "\\.(pem|key|p12|pfx|jks|keystore)${A}"

  # mobile / firebase
  "${B}google-services\\.json${A}"
  "${B}GoogleService-Info\\.plist${A}"
  "\\.xcconfig${A}"
  "\\.(mobileprovision|provisionprofile)${A}"
  "${B}(firebase-adminsdk|service[-_]account)[^[:space:]/]*\\.json${A}"

  # shell history
  "${B}\\.(bash|zsh|python|mysql|psql)_history${A}"

  # terraform
  "\\.tfstate(\\.backup)?${A}"
  "${B}terraform\\.tfvars${A}"
  "\\.auto\\.tfvars${A}"
)

# --- allowlist (template / example files teams commit on purpose) ----------
ALLOWED=(
  "\\.env\\.(example|sample|template|dist)${A}"
)

# --- scan every target -----------------------------------------------------
matched_target=""
matched_pattern=""

for target in "${TARGETS[@]}"; do
  [[ -z "$target" ]] && continue

  hit_pat=""
  for pat in "${PROTECTED[@]}"; do
    if printf '%s' "$target" | grep -Eq "$pat"; then
      hit_pat="$pat"
      break
    fi
  done
  [[ -z "$hit_pat" ]] && continue

  is_allowed=0
  for apat in "${ALLOWED[@]}"; do
    if printf '%s' "$target" | grep -Eq "$apat"; then
      is_allowed=1
      break
    fi
  done
  [[ $is_allowed -eq 1 ]] && continue

  matched_target="$target"
  matched_pattern="$hit_pat"
  break
done

# --- decide ----------------------------------------------------------------
if [[ -n "$matched_target" ]]; then
  cat >&2 <<EOF
🚫 protect-files hook BLOCKED this tool call.

Target: $matched_target
Pattern: /$matched_pattern/

This path is protected by .claude/hooks/protect-files.sh because it commonly
contains secrets, credentials, or private keys.

What to do:
  1. If the file is truly non-sensitive (e.g. a template), add its pattern
     to the ALLOWED list in .claude/hooks/protect-files.sh.
  2. Ask the human to paste the specific value you need instead of reading
     the file.
  3. Temporary bypass (human only, single session):
       CLAUDE_PROTECT_DISABLE=1 claude
EOF
  exit 2
fi

exit 0