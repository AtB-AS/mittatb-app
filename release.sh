#!/bin/bash
# This script automates the release process based on the current branch.
#
# Usage: ./release.sh [test]
#
# - On 'master' branch: Starts a new release cycle (e.g., v1.80-rc1).
# - On 'release/x.xx' branch: Creates the next release candidate (e.g., v1.80-rc2).
# - Add 'test' argument to preview what would happen without making changes.

set -e

# DRY RUN check
DRY_RUN=false
if [[ "$1" == "test" || "$1" == "dry-run" ]]; then
  DRY_RUN=true
  echo "============================================"
  echo "🧪 DRY RUN MODE - No changes will be made"
  echo "============================================"
  echo ""
fi

# --- Determine current branch ---
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

VERSION=""
IS_NEW_RELEASE_CYCLE=false
RELEASE_BRANCH=""
NEXT_MASTER_VERSION=""
LATEST_RELEASE_BRANCH=""
MAJOR_MINOR=""

# --- Logic for 'master' branch ---
if [[ "$CURRENT_BRANCH" == "master" ]]; then
  IS_NEW_RELEASE_CYCLE=true

  # Fetch to get all remote branches
  git fetch --all --quiet

  # Find the latest release branch matching ONLY release/X.XX format (no patch versions or suffixes)
  LATEST_RELEASE_BRANCH=$(git branch -r | grep -E '^[[:space:]]*origin/release/[0-9]+\.[0-9]+$' | sed 's|.*origin/release/||' | sort -t. -k1,1n -k2,2n | tail -n1)

  if [ -z "$LATEST_RELEASE_BRANCH" ]; then
    echo "Error: No existing release branches found."
    exit 1
  fi

  # Parse and increment minor version
  MAJOR=$(echo "$LATEST_RELEASE_BRANCH" | cut -d. -f1)
  MINOR=$(echo "$LATEST_RELEASE_BRANCH" | cut -d. -f2)
  NEXT_MINOR=$((MINOR + 1))
  MAJOR_MINOR="$MAJOR.$NEXT_MINOR"

  VERSION="$MAJOR_MINOR-rc1"
  RELEASE_BRANCH="release/$MAJOR_MINOR"
  NEXT_MASTER_VERSION="$MAJOR_MINOR"

# --- Logic for 'release' branch ---
elif [[ "$CURRENT_BRANCH" == "release/"* ]]; then
  MAJOR_MINOR=$(echo "$CURRENT_BRANCH" | sed 's/release\///')
  RELEASE_BRANCH="$CURRENT_BRANCH"

  # Fetch tags to get the latest RC version
  git fetch --tags --quiet
  LATEST_TAG=$(git tag --sort=-v:refname | grep "^v$MAJOR_MINOR-rc" | head -n1)

  if [ -z "$LATEST_TAG" ]; then
    VERSION="$MAJOR_MINOR-rc1"
  else
    LATEST_RC=$(echo "$LATEST_TAG" | sed -E "s/v$MAJOR_MINOR-rc//")
    NEXT_RC=$((LATEST_RC + 1))
    VERSION="$MAJOR_MINOR-rc$NEXT_RC"
  fi

# --- Invalid branch ---
else
  echo "Error: You must be on the 'master' branch or a 'release/x.xx' branch to run this script."
  exit 1
fi

# --- Dry run output ---
if [ "$DRY_RUN" = true ]; then
  echo "📍 Current branch:         $CURRENT_BRANCH"
  if [ -n "$LATEST_RELEASE_BRANCH" ]; then
    echo "📦 Latest release branch:  release/$LATEST_RELEASE_BRANCH"
  fi
  echo "🌿 Target release branch:  $RELEASE_BRANCH"
  echo "🏷️  Release version:        v$VERSION"
  if [ "$IS_NEW_RELEASE_CYCLE" = true ]; then
    echo "⬆️  Next master version:    $NEXT_MASTER_VERSION"
  fi
  echo ""
  echo "============================================"
  echo "Run without 'test' to execute the release."
  echo "============================================"
  exit 0
fi

# --- RELEASE START HERE ---
echo "Current branch is '$CURRENT_BRANCH'."

if [ "$IS_NEW_RELEASE_CYCLE" = true ]; then
  echo "On 'master' branch. Starting a new release cycle."
  echo "Latest release branch found: release/$LATEST_RELEASE_BRANCH"

  # Check if release branch already exists
  if git show-ref --verify --quiet "refs/remotes/origin/$RELEASE_BRANCH"; then
    echo "Error: Release branch '$RELEASE_BRANCH' already exists. Switch to it and run again to create next RC."
    exit 1
  fi

  # Create and switch to the new release branch
  echo "Creating new release branch '$RELEASE_BRANCH'..."
  git checkout -b "$RELEASE_BRANCH"
  git push -u origin "$RELEASE_BRANCH"
  echo "Successfully created and pushed '$RELEASE_BRANCH'."
else
  echo "On a release branch. Creating next release candidate."
fi

echo "Determined next release version: $VERSION"

# --- Step 2: Create GitHub Release Draft ---
echo "--- Step 2: Creating GitHub release draft ---"
yarn release-draft "v$VERSION"
echo "Successfully created draft release for v$VERSION."

# --- Step 3: Publish GitHub Release ---
echo "--- Step 3: Publishing GitHub Release ---"
gh release edit "v$VERSION" --draft=false
echo "Successfully published release v$VERSION. The build pipeline has been triggered."

# --- Step 4: Bump version on master (for new release cycles only) ---
if [ "$IS_NEW_RELEASE_CYCLE" = true ]; then
  echo "--- Step 4: Bumping version on master and registering at Entur ---"
  git checkout master
  git pull origin master

  # The next version on master is the new major.minor
  BUMP_BRANCH="chore/bump-version-$NEXT_MASTER_VERSION"
  git checkout -b "$BUMP_BRANCH"

  # Run the version bump script
  if [ -f "./scripts/update-app-version.sh" ]; then
    ./scripts/update-app-version.sh "$NEXT_MASTER_VERSION"
  else
    echo "Warning: ./scripts/update-app-version.sh not found. Skipping version bump on master."
  fi

  # Run the Entur registration script
  if [ -f "./scripts/register-local-app-version.sh" ]; then
    ./scripts/register-local-app-version.sh
  else
    echo "Warning: ./scripts/register-local-app-version.sh not found. Skipping Entur registration."
  fi

  git commit -am "chore: Bump to version $NEXT_MASTER_VERSION and register at Entur"
  git push -u origin "$BUMP_BRANCH"
  echo "Pushed version bump commit to '$BUMP_BRANCH'."

  # Create PR for version bump
  echo "Creating pull request to merge version bump into master..."
  PR_URL=$(gh pr create --base master --head "$BUMP_BRANCH" --title "chore: Bump to version $NEXT_MASTER_VERSION" --body "Automated version bump and Entur registration.")
  echo "Pull request created, ready for review: $PR_URL"
fi

echo "--- Release process complete! ---"
