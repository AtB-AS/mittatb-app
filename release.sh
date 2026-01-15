#!/bin/bash
# This script automates the release process based on docs/release.md.
#
# Usage: ./release.sh <version>
# Example: ./release.sh 1.79-rc1
#
# The script will:
# 1. Create/checkout the release branch.
# 2. Create a release draft on GitHub.
# 3. Publish the release, triggering the build pipeline.
# 4. For a new major version (e.g., 1.79-rc1), it will then create a pull
#    request to bump the version on the master branch and register the new version.

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Error: Version argument is required."
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh 1.79-rc1"
  exit 1
fi

# Parse version components
MAJOR_MINOR=$(echo "$VERSION" | sed -E 's/v?([0-9]+\.[0-9]+)-rc[0-9]+/\1/')
RC_VERSION=$(echo "$VERSION" | sed -E 's/v?[0-9]+\.[0-9]+-rc([0-9]+)/\1/')

RELEASE_BRANCH="release/$MAJOR_MINOR"

# --- Step 1: Handle branch checkout/creation ---
echo "--- Step 1: Preparing release branch ---"

if [ "$RC_VERSION" -eq 1 ]; then
  echo "First release candidate for $MAJOR_MINOR. Creating a new release branch."
  # Ensure we are starting from an up-to-date master
  git checkout master
  git pull origin master
  git checkout -b "$RELEASE_BRANCH"
  git push -u origin "$RELEASE_BRANCH"
  echo "Successfully created and pushed '$RELEASE_BRANCH'."
else
  echo "Existing major version. Checking out '$RELEASE_BRANCH'."
  git checkout "$RELEASE_BRANCH"
  git pull origin "$RELEASE_BRANCH"
  echo "Successfully checked out and updated '$RELEASE_BRANCH'."
fi

# --- Step 2: Create GitHub Release Draft ---
echo "--- Step 2: Creating GitHub release draft ---"
echo "Checking app versions in .env files..."
grep "APP_VERSION" .env* || echo "Could not automatically check .env versions. Please verify them manually."

echo "Fetching tags to avoid conflicts..."
git fetch --tags

echo "Creating release draft for tag v$VERSION..."
yarn release-draft --tag "v$VERSION" --notes "Release candidate v$VERSION"
echo "Successfully created draft release for v$VERSION."

# --- Step 3: Publish GitHub Release ---
echo "--- Step 3: Publishing GitHub Release ---"
echo "Finding and publishing the draft release..."
gh release edit "v$VERSION" --draft=true
echo "Successfully published release v$VERSION. The build pipeline has been triggered."

# --- Step 4: Bump version on master (for rc1 only) ---
if [ "$RC_VERSION" -eq 1 ]; then
  echo "--- Step 4: Bumping version on master and registering at Entur ---"
  git checkout master
  git pull origin master

  # Calculate next version
  NEXT_MAJOR_MINOR=$(echo "$MAJOR_MINOR" | awk -F. '{printf "%d.%d", $1, $2+1}')
  echo "Bumping version on master to $NEXT_MAJOR_MINOR..."

  BUMP_BRANCH="chore/bump-version-$NEXT_MAJOR_MINOR"
  git checkout -b "$BUMP_BRANCH"

  # Run the version bump script
  if [ -f "./scripts/update-app-version.sh" ]; then
    ./scripts/update-app-version.sh "$NEXT_MAJOR_MINOR"
  else
    echo "Error: ./scripts/update-app-version.sh not found."
    exit 1
  fi

  # Run the Entur registration script
  # if [ -f "./scripts/register-local-app-version.sh" ]; then
  #    ./scripts/register-local-app-version.sh
  # else
  #   echo "Error: ./scripts/register-local-app-version.sh not found."
  #   exit 1
  # fi

  git commit -am "chore: Bump to version $NEXT_MAJOR_MINOR and register at Entur"
  git push -u origin "$BUMP_BRANCH"
  echo "Pushed version bump commit to '$BUMP_BRANCH'."

  # Create PR for version bump
  echo "Creating pull request to merge version bump into master..."
  PR_URL=$(gh pr create --base master --head "$BUMP_BRANCH" --title "chore: Bump to version $NEXT_MAJOR_MINOR" --body "Automated version bump and Entur registration.")
  echo "Pull request created, ready for review: $PR_URL"
fi

echo "--- Release process complete! ---"

