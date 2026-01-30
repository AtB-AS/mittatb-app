#!/bin/bash
set -euo pipefail

BRANCH_NAME="${BRANCH_NAME:-}"

CURRENT_VERSION=$(node -p "require('./package.json').version")

# Master branch: do nothing, use version as-is
if [[ "$BRANCH_NAME" == "master" ]]; then
  echo "new_version_name=$CURRENT_VERSION" >> "$GITHUB_OUTPUT"
  echo "Version name will be: $CURRENT_VERSION"
  exit 0
fi

# Release branch: append full branch name (e.g., release/1.xx)
if [[ "$BRANCH_NAME" == release/* ]]; then
  NEW_VERSION_NAME="${CURRENT_VERSION} - ${BRANCH_NAME}"
  echo "branch_name=$BRANCH_NAME" >> "$GITHUB_OUTPUT"
  echo "new_version_name=$NEW_VERSION_NAME" >> "$GITHUB_OUTPUT"
  echo "Version name will be: $NEW_VERSION_NAME"
  exit 0
fi

# Other branches (feature branches): remove username prefix, sanitize
SANITIZED_BRANCH=$(echo "$BRANCH_NAME" | cut -d'/' -f2- | sed 's/\//-/g' | cut -c1-30)
NEW_VERSION_NAME="${CURRENT_VERSION} - ${SANITIZED_BRANCH}"

echo "branch_name=$SANITIZED_BRANCH" >> "$GITHUB_OUTPUT"
echo "new_version_name=$NEW_VERSION_NAME" >> "$GITHUB_OUTPUT"
echo "Version name will be: $NEW_VERSION_NAME"