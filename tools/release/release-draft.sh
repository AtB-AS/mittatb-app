#!/bin/bash

# This script creates the release draft based on the specified tag.
#
# Usage: ./release-draft.sh [<version>] [--preview]
#
# Examples:
#   ./release-draft.sh                   Interactive mode
#   ./release-draft.sh --preview         Interactive mode, preview only
#   ./release-draft.sh v1.80-rc1         Create draft release
#   ./release-draft.sh v1.80 --preview   Preview changelog only
#
# Options:
#   <version>   Release tag (format: v1.x, e.g., v1.80, v1.80-rc1)
#   --preview   Preview the changelog without creating a release

# Sync tags with remote
git fetch --tags --prune-tags

preview=false
releaseVersion=""

# Parse arguments
for arg in "$@"; do
  if [[ "$arg" == "--preview" ]]; then
    preview=true
  elif [[ "$arg" =~ ^v[0-9]+\.[0-9]+.*$ ]]; then
    releaseVersion="$arg"
  else
    echo "Unknown argument: $arg"
    exit 1
  fi
done

branch=$(git rev-parse --abbrev-ref HEAD)
# if [[ "$branch" != "master" && "$branch" != "release/"* ]]; then
#   echo 'You have to be on master or release branch to do a new release';
#   exit 1;
# fi

# If no version provided, fall back to interactive mode
if [ -z "$releaseVersion" ]; then
  read -p "What do you want the release tag to be? The usual format is v1.x, for example v1.5. Can also suffix with -rc or similar:
" -r
  echo
  releaseVersion=$REPLY

  if [[ ! $releaseVersion =~ ^v[0-9]+\.[0-9]+.*$ ]]; then
    echo "The format has to start with 'v1.x' "
    exit 1;
  fi

  if [ "$preview" = false ]; then
    read -p "This will create a draft release $releaseVersion on Github, are you sure you want to do release? (N/y) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 0;
    fi
  fi
else
  echo "Creating draft release for $releaseVersion"
fi


echo 'Gathering commits and creating changelog'
message=$(yarn --silent conventional-changelog -p angular -n ./tools/release/changelog.config.js)

if [ $? -eq 0 ]; then
  if [ "$preview" = true ]; then
    echo "=== PREVIEW ==="
    echo "Would create release: $releaseVersion"
    echo "Target branch: $branch"
    echo "=== Changelog message ==="
    echo "$message"
  else
    gh release create "$releaseVersion" --draft --title "$releaseVersion release draft" --notes "$message" --target "$branch"
  fi
else
  echo 'Could not create changelog'
  exit 1;
fi
