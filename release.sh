#!/bin/bash
# This script automates the release process based on the current branch.
#
# Usage: ./release.sh
#
# - On 'master' branch: Starts a new release cycle (e.g., v1.80-rc1).
# - On 'release/x.xx' branch: Creates the next release candidate (e.g., v1.80-rc2).

set -e

# --- Determine current branch ---
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is '$CURRENT_BRANCH'."

VERSION=""
IS_NEW_RELEASE_CYCLE=false

# --- Logic for 'master' branch ---
if [[ "$CURRENT_BRANCH" == "master" ]]; then
  echo "On 'master' branch. Starting a new release cycle."
  IS_NEW_RELEASE_CYCLE=true

  # Get current version from package.json and increment minor version
  CURRENT_VERSION=$(node -p "require('./package.json').version")
  MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)
  MINOR=$(echo "$CURRENT_VERSION" | cut -d. -f2)
  NEXT_MINOR=$((MINOR + 1))
  MAJOR_MINOR="$MAJOR.$NEXT_MINOR"

  VERSION="$MAJOR_MINOR-rc1"
  RELEASE_BRANCH="release/$MAJOR_MINOR"

  # Create and switch to the new release branch
  echo "Creating new release branch '$RELEASE_BRANCH'..."
  git checkout -b "$RELEASE_BRANCH"
  git push -u origin "$RELEASE_BRANCH"
  echo "Successfully created and pushed '$RELEASE_BRANCH'."

# --- Logic for 'release' branch ---
elif [[ "$CURRENT_BRANCH" == "release/"* ]]; then
  echo "On a release branch. Creating next release candidate."
  MAJOR_MINOR=$(echo "$CURRENT_BRANCH" | sed 's/release\///')

  # Fetch tags to get the latest RC version
  git fetch --tags
  LATEST_TAG=$(git tag --sort=-v:refname | grep "^v$MAJOR_MINOR-rc" | head -n1)

  if [ -z "$LATEST_TAG" ]; then
    echo "No release candidates found for $MAJOR_MINOR. Starting with rc1."
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

echo "Determined next release version: $VERSION"

# --- Step 2: Create GitHub Release Draft ---
echo "--- Step 2: Creating GitHub release draft ---"
# The yarn script now takes the version as an argument
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
  NEXT_MASTER_VERSION="$MAJOR_MINOR"
  BUMP_BRANCH="chore/bump-version-$NEXT_MASTER_VERSION"
  git checkout -b "$BUMP_BRANCH"

  # Run the version bump script
  # Note: Assuming this script updates package.json and other necessary files
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
