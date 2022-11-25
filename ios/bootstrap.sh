#!/bin/sh

brew_install() {
  echo "Brew is trying to install / update $1"
  if command -v $1 >/dev/null; then
    brew upgrade "$1"
  else
    brew install "$1"
    brew link "$1"
  fi
}

# Install Homebrew
if command -v brew >/dev/null; then
  echo "Homebrew already installed, trying to update..."
  brew update
else
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

if [ -e "Mintfile" ]; then
  brew_install mint

  # Install Mint required packages
  mint bootstrap
fi