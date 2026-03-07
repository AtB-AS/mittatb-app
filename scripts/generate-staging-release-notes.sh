#!/bin/bash
set -euo pipefail

BRANCH_NAME="${BRANCH_NAME:-}"
OUTPUT_FILE="${OUTPUT_FILE:-./release-notes.txt}"

# If on master or release/**, get branch name from merge commit
if [[ "$BRANCH_NAME" == "master" || "$BRANCH_NAME" == release/* ]]; then
  MERGE_MSG=$(git log -1 --pretty=%s)
  echo "Merge commit message: $MERGE_MSG"
  
  if [[ "$MERGE_MSG" =~ ^Merge\ pull\ request ]]; then
    # Format: "Merge pull request #123 from username/feature-name"
    FULL_BRANCH_NAME=$(echo "$MERGE_MSG" | sed 's/.*from //')
    
    # Get commits from the merge (parent 2 is the feature branch)
    COMMITS=$(git log --oneline HEAD^2 ^HEAD^1 2>/dev/null | head -10 || echo "- $(git log -1 --pretty=%s)")
  elif [[ "$MERGE_MSG" =~ ^Merge\ branch ]]; then
    # Format: "Merge branch 'feature-name' into master"
    FULL_BRANCH_NAME=$(echo "$MERGE_MSG" | sed "s/Merge branch '\([^']*\)'.*/\1/")
    COMMITS=$(git log --oneline HEAD^2 ^HEAD^1 2>/dev/null | head -10 || echo "- $(git log -1 --pretty=%s)")
  else
    # Direct push, no merge
    FULL_BRANCH_NAME="$BRANCH_NAME"
    COMMITS=$(git log -1 --pretty=%s)
  fi
else
  # Running on feature branch directly
  FULL_BRANCH_NAME="$BRANCH_NAME"
  # Get last 10 commits on this branch (compared to master)
  COMMITS=$(git log --oneline origin/master..HEAD 2>/dev/null | head -10 || git log --oneline -5)
fi

echo "Full branch name: $FULL_BRANCH_NAME"

# Format commits as bullet points
FORMATTED_COMMITS=$(echo "$COMMITS" | sed 's/^[a-f0-9]* /- /')

# Generate release notes
cat > "$OUTPUT_FILE" << EOF
Branch: $FULL_BRANCH_NAME

Commits:
$FORMATTED_COMMITS
EOF

echo "Release notes generated:"
cat "$OUTPUT_FILE"

# Also output for GitHub Actions
echo "full_branch_name=$FULL_BRANCH_NAME" >> "$GITHUB_OUTPUT"