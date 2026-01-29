#!/bin/bash
set -euo pipefail

BRANCH_NAME="${BRANCH_NAME:-}"

# If on master or release/**, get branch name from merge commit
if [[ "$BRANCH_NAME" == "master" || "$BRANCH_NAME" == release/* ]]; then
  MERGE_MSG=$(git log -1 --pretty=%s)
  echo "Merge commit message: $MERGE_MSG"
  
  if [[ "$MERGE_MSG" =~ ^Merge\ pull\ request ]]; then
    BRANCH_NAME=$(echo "$MERGE_MSG" | sed 's/.*from //')
  elif [[ "$MERGE_MSG" =~ ^Merge\ branch ]]; then
    BRANCH_NAME=$(echo "$MERGE_MSG" | sed "s/Merge branch '\([^']*\)'.*/\1/")
  else
    BRANCH_NAME="build-$(git rev-parse --short HEAD)"
  fi
fi

echo "Detected branch: $BRANCH_NAME"

SANITIZED_BRANCH=$(echo "$BRANCH_NAME" | cut -d'/' -f2- | sed 's/\//-/g' | cut -c1-30)
CURRENT_VERSION=$(node -p "require('./package.json').version")
NEW_VERSION_NAME="${CURRENT_VERSION} - ${SANITIZED_BRANCH}"

echo "branch_name=$SANITIZED_BRANCH" >> "$GITHUB_OUTPUT"
echo "new_version_name=$NEW_VERSION_NAME" >> "$GITHUB_OUTPUT"
echo "Version name will be: $NEW_VERSION_NAME"