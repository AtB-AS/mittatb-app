#!/bin/bash
# This script automates the release process based on the current branch.
#
# Usage: ./release.sh [--preview|--publish] [--orgs <org,...>] [--help]
#
# - On 'master' branch: Starts a new release cycle (e.g., v1.80-rc1).
# - On 'release/x.xx' branch: Creates the next release candidate (e.g., v1.80-rc2).
# - On other branch: Runs the script as if in `master` with --preview flag 
#
# Options:
#   --preview   Preview the release details without making changes
#   --publish   Create and publish the release immediately (draft=false)
#   --orgs      Only build these orgs, e.g. --orgs troms,fram,nfk (e.g., v1.80-rc2-troms-fram-nfk).
#               Only on 'release/x.xx' branches. Valid orgs are read from .github/workflows/select-orgs.yml
#   --help      Show this help
#   (none)      Create the release as a draft (draft=true)
#
# Options can be given in any order; the org list must directly follow --orgs (or use --orgs=troms,nfk).

set -e

print_help() {
  # Prints the comment block at the top of this file
  sed -n '2,/^[^#]/s/^# \{0,1\}//p' "$0"
}

# --- Parse arguments ---
DRY_RUN=false
DRAFT=true
ORGS_ARG=""
HAS_ORGS_ARG=false

while [ $# -gt 0 ]; do
  case "$1" in
    --preview)
      DRY_RUN=true
      ;;
    --publish)
      DRAFT=false
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    --orgs)
      HAS_ORGS_ARG=true
      ORGS_ARG="${2:-}"
      if [ $# -gt 1 ]; then shift; fi
      ;;
    --orgs=*)
      HAS_ORGS_ARG=true
      ORGS_ARG="${1#--orgs=}"
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: ./release.sh [--preview] [--publish] [--orgs <org,...>] [--help]"
      exit 1
      ;;
  esac
  shift
done

# Prevent conflicting arguments
if [ "$DRY_RUN" = true ] && [ "$DRAFT" = false ]; then
  echo "Error: Cannot use '--preview' and '--publish' together."
  echo "Usage: ./release.sh [--preview|--publish]"
  exit 1
fi

# --- Validate orgs against the store workflows ---
ORGS_SUFFIX=""
if [ "$HAS_ORGS_ARG" = true ]; then
  KNOWN_ORGS=$(sed -nE 's/^[[:space:]]*ORGS:[[:space:]]*(.*)$/\1/p' .github/workflows/select-orgs.yml)
  if [ -z "$KNOWN_ORGS" ]; then
    echo "Error: Could not read ORGS from .github/workflows/select-orgs.yml"
    exit 1
  fi
  # Strict format, so an empty or malformed list can't fall back to an all-org release
  if [[ ! "$ORGS_ARG" =~ ^[a-z]+(,[a-z]+)*$ ]]; then
    echo "Error: '--orgs' needs a comma-separated list of orgs, e.g. --orgs troms,nfk (known: $KNOWN_ORGS)"
    exit 1
  fi
  for org in ${ORGS_ARG//,/ }; do
    if [[ " $KNOWN_ORGS " != *" $org "* ]]; then
      echo "Error: Unknown org '$org' (known: $KNOWN_ORGS)"
      exit 1
    fi
    if [[ "$ORGS_SUFFIX-" == *"-$org-"* ]]; then
      echo "Error: Org '$org' is listed more than once"
      exit 1
    fi
    ORGS_SUFFIX="$ORGS_SUFFIX-$org"
  done
fi

# --- Determine current branch ---
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Branches other than master and release is treated as master, and runs in preview mode
if [[ "$CURRENT_BRANCH" != "master" && "$CURRENT_BRANCH" != "release/"* ]]; then
  echo "⚠️  Not on 'master' or 'release/*' branch."
  echo "   Treating as 'master' in preview mode."
  echo "   Run in 'master' or 'release/*' for actual release."
  echo ""
  CURRENT_BRANCH="master"
  DRY_RUN=true
fi

# --- Read current version from package.json ---
CURRENT_PACKAGE_VERSION=$(node -p "require('./package.json').version")
PKG_MAJOR=$(echo "$CURRENT_PACKAGE_VERSION" | cut -d. -f1)
PKG_MINOR=$(echo "$CURRENT_PACKAGE_VERSION" | cut -d. -f2)

VERSION=""
IS_NEW_RELEASE_CYCLE=false
RELEASE_BRANCH=""
NEXT_MASTER_VERSION=""
LATEST_RELEASE_BRANCH=""
MAJOR_MINOR=""

# --- Logic for 'master' branch ---
if [[ "$CURRENT_BRANCH" == "master" ]]; then
  IS_NEW_RELEASE_CYCLE=true

  # Fetch to get remote branches, also remove stale branches
  git fetch --prune --quiet

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

  # Get NEXT_MASTER_VERSION from package.json
  PKG_NEXT_MINOR=$((PKG_MINOR + 1))
  NEXT_MASTER_VERSION="$PKG_MAJOR.$PKG_NEXT_MINOR"

  if [ -n "$ORGS_SUFFIX" ]; then
    echo "Error: '--orgs' can only be used on a 'release/x.xx' branch, not when starting a new release cycle."
    exit 1
  fi

# --- Logic for 'release' branch ---
elif [[ "$CURRENT_BRANCH" == "release/"* ]]; then
  MAJOR_MINOR=$(echo "$CURRENT_BRANCH" | sed 's/release\///')
  RELEASE_BRANCH="$CURRENT_BRANCH"

  if [[ "$PKG_MAJOR.$PKG_MINOR" != "$MAJOR_MINOR" ]]; then
    echo "⚠️  package.json version ($CURRENT_PACKAGE_VERSION) does not match release branch '$CURRENT_BRANCH'."
    echo ""
  fi

  # Fetch tags to get the latest RC version
  git fetch --tags --prune-tags --quiet 
  # Includes org-specific tags (e.g. v1.80-rc3-nfk), so the next RC number is never reused
  LATEST_TAG=$(git tag --sort=-v:refname | grep -E "^v${MAJOR_MINOR//./\\.}-rc[0-9]+(-|$)" | head -n1)

  if [ -z "$LATEST_TAG" ]; then
    VERSION="$MAJOR_MINOR-rc1"
  else
    # Extract only the RC number, ignoring any org suffix
    LATEST_RC=$(echo "$LATEST_TAG" | sed -E 's/.*-rc0*([0-9]+).*/\1/')
    NEXT_RC=$((LATEST_RC + 1))
    VERSION="$MAJOR_MINOR-rc$NEXT_RC"
  fi
  VERSION="$VERSION$ORGS_SUFFIX"
fi

# --- Dry run output ---
if [ "$DRY_RUN" = true ]; then
  if [ "$IS_NEW_RELEASE_CYCLE" = true ]; then
    echo "📍 Current branch:         $CURRENT_BRANCH (version $PKG_MAJOR.$PKG_MINOR)"
  else
    echo "📍 Current branch:         $CURRENT_BRANCH"
  fi
  if [ -n "$LATEST_RELEASE_BRANCH" ]; then
    echo "📦 Latest release branch:  release/$LATEST_RELEASE_BRANCH"
  fi
  echo "🌿 Target release branch:  $RELEASE_BRANCH"
  echo "🏷️  Release version:        v$VERSION"
  if [ -n "$ORGS_SUFFIX" ]; then
    echo "🏢 Orgs:                   $(echo "${ORGS_SUFFIX#-}" | tr '-' ' ')"
  else
    echo "🏢 Orgs:                   all"
  fi
  if [ "$IS_NEW_RELEASE_CYCLE" = true ]; then
    echo "⬆️  Next master version:    $NEXT_MASTER_VERSION"
  fi
  echo ""
  echo "==============================================="
  echo "Run without '--preview' to execute the release."
  echo "==============================================="
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
pnpm release-draft "v$VERSION"
echo "Successfully created draft release for v$VERSION."

# --- Step 3: Publish GitHub Release ---
if [ "$DRAFT" = false ]; then
  echo "--- Step 3: Publishing GitHub Release ---"
  gh release edit "v$VERSION" --draft=false
  echo "Successfully published release v$VERSION. The build pipeline has been triggered."
else
  echo "--- Step 3: Skipping publish (draft mode) ---"
  echo "Release v$VERSION created as draft."
  echo "To publish later, run: gh release edit v$VERSION --draft=false or publish manually from GitHub Releases page"
fi

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
  PR_URL=$(gh pr create --draft --base master --head "$BUMP_BRANCH" --title "chore: Bump to version $NEXT_MASTER_VERSION" --body "Automated version bump and Entur registration.")
  echo "Pull request created, ready for review: $PR_URL"
fi

echo "--- Release process complete! ---"
