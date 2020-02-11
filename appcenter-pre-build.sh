#!/usr/bin/env bash

brew tap wix/brew
brew update
brew install applesimutils

echo "Building the project for Detox tests..."
npx detox build 

echo "Executing Detox tests..."
npx detox test --cleanup