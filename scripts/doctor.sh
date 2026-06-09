#!/bin/sh

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

pass() { printf "  ${GREEN}✓${NC} %s\n" "$1"; PASS_COUNT=$((PASS_COUNT + 1)); }
fail() { printf "  ${RED}✗${NC} %s\n" "$1"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
warn() { printf "  ${YELLOW}⚠${NC} %s\n" "$1"; WARN_COUNT=$((WARN_COUNT + 1)); }
section() { printf "\n${BOLD}%s${NC}\n" "$1"; }

is_integer() { expr "$1" : '^[0-9][0-9]*$' >/dev/null 2>&1; }

printf "\n${BOLD}AtB App – Environment Doctor${NC}\n"
echo "Checking your development environment..."

REPO_ROOT="$(git rev-parse --show-toplevel)" || { echo "Not in a git repo"; exit 1; }
OS="$(uname -s)"

# --- Requirements ---

# Ruby (README requirement 1)
section "Ruby"
REQUIRED_RUBY=$(tr -d '[:space:]' < "$REPO_ROOT/.ruby-version")
if command -v ruby >/dev/null 2>&1; then
  RUBY_VERSION=$(ruby --version | awk '{print $2}' | sed 's/p.*//')
  if [ "$RUBY_VERSION" = "$REQUIRED_RUBY" ]; then
    pass "ruby $RUBY_VERSION"
  else
    fail "ruby $RUBY_VERSION (required: $REQUIRED_RUBY) – see README"
  fi
else
  fail "ruby not found (required: $REQUIRED_RUBY) – see README"
fi

# Node.js (README requirement 2 – React Native environment)
section "Node.js"
if command -v node >/dev/null 2>&1; then
  NODE_VERSION=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if is_integer "$NODE_MAJOR" && [ "$NODE_MAJOR" -ge 22 ]; then
    pass "node $NODE_VERSION"
  else
    fail "node $NODE_VERSION (required: >=22) – see https://reactnative.dev/docs/set-up-your-environment"
  fi
else
  fail "node not found (required: >=22) – see https://reactnative.dev/docs/set-up-your-environment"
fi

# Watchman (recommended by React Native for both platforms)
section "Watchman"
if command -v watchman >/dev/null 2>&1; then
  WATCHMAN_VERSION=$(watchman --version 2>/dev/null)
  pass "watchman $WATCHMAN_VERSION"
else
  warn "watchman not found (recommended) – see https://reactnative.dev/docs/set-up-your-environment"
fi

# iOS toolchain – requirements (macOS only)
case "$OS" in Darwin)
  section "Xcode"
  if command -v xcodebuild >/dev/null 2>&1; then
    XCODE_VERSION=$(xcodebuild -version 2>/dev/null | head -1 | awk '{print $2}')
    pass "Xcode $XCODE_VERSION"
    if xcode-select -p >/dev/null 2>&1; then
      pass "Xcode Command Line Tools"
    else
      fail "Xcode Command Line Tools not installed – see https://reactnative.dev/docs/set-up-your-environment"
    fi
    if grep -q "NODE_BINARY" "$REPO_ROOT/ios/.xcode.env" 2>/dev/null || \
       grep -q "NODE_BINARY" "$REPO_ROOT/ios/.xcode.env.local" 2>/dev/null; then
      pass ".xcode.env NODE_BINARY configured"
    else
      warn ".xcode.env missing NODE_BINARY – Xcode builds may fail with NVM (see React Native docs)"
    fi
  else
    fail "Xcode not found – see https://reactnative.dev/docs/set-up-your-environment"
  fi

  section "CocoaPods"
  REQUIRED_POD=$(awk '/^COCOAPODS:/{print $2}' "$REPO_ROOT/ios/Podfile.lock")
  if command -v pod >/dev/null 2>&1; then
    POD_VERSION=$(pod --version)
    if [ "$POD_VERSION" = "$REQUIRED_POD" ]; then
      pass "cocoapods $POD_VERSION"
    else
      warn "cocoapods $POD_VERSION (required: $REQUIRED_POD) – see https://reactnative.dev/docs/set-up-your-environment"
    fi
  else
    warn "cocoapods not found – see https://reactnative.dev/docs/set-up-your-environment"
  fi
esac

# Android SDK (README requirement 2 – React Native environment)
section "Android SDK"
case "$OS" in
  Darwin) ANDROID_SDK="${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}" ;;
  *)      ANDROID_SDK="${ANDROID_SDK_ROOT:-$HOME/Android/Sdk}" ;;
esac
if [ -d "$ANDROID_SDK" ]; then
  pass "Android SDK at $ANDROID_SDK"
  REQUIRED_BUILD_TOOLS=$(grep 'buildToolsVersion' "$REPO_ROOT/android/build.gradle" 2>/dev/null | awk -F'"' '{print $2}')
  LATEST_BUILD_TOOLS=$(ls "$ANDROID_SDK/build-tools/" 2>/dev/null | sort -t. -k1,1n -k2,2n -k3,3n | tail -1)
  if [ -z "$LATEST_BUILD_TOOLS" ]; then
    fail "Android build tools not found – see https://reactnative.dev/docs/set-up-your-environment"
  elif [ -n "$REQUIRED_BUILD_TOOLS" ] && [ -d "$ANDROID_SDK/build-tools/$REQUIRED_BUILD_TOOLS" ]; then
    pass "build-tools $REQUIRED_BUILD_TOOLS"
  elif [ -n "$REQUIRED_BUILD_TOOLS" ]; then
    fail "build-tools $REQUIRED_BUILD_TOOLS not found (latest installed: $LATEST_BUILD_TOOLS) – see https://reactnative.dev/docs/set-up-your-environment"
  else
    pass "build-tools $LATEST_BUILD_TOOLS"
  fi
  REQUIRED_SDK=$(grep 'compileSdkVersion\s*=' "$REPO_ROOT/android/build.gradle" 2>/dev/null | awk -F'= ' '{print $2}' | tr -d ' ')
  if [ -n "$REQUIRED_SDK" ] && [ -d "$ANDROID_SDK/platforms/android-$REQUIRED_SDK" ]; then
    pass "Android SDK Platform $REQUIRED_SDK"
  elif [ -n "$REQUIRED_SDK" ]; then
    fail "Android SDK Platform $REQUIRED_SDK not found – see https://reactnative.dev/docs/set-up-your-environment"
  fi
else
  warn "Android SDK not found – see https://reactnative.dev/docs/set-up-your-environment"
fi

# Java (README requirement 2 – React Native environment)
section "Java"
if command -v java >/dev/null 2>&1; then
  JAVA_VERSION=$(java -version 2>&1 | awk -F '"' 'NR==1{print $2}')
  JAVA_MAJOR=$(echo "$JAVA_VERSION" | cut -d. -f1)
  if ! is_integer "$JAVA_MAJOR"; then
    fail "java: could not parse version"
  elif [ "$JAVA_MAJOR" -ge 17 ]; then
    pass "java $JAVA_VERSION"
  else
    fail "java $JAVA_VERSION (required: >=17) – see https://reactnative.dev/docs/set-up-your-environment"
  fi
else
  fail "java not found (required: >=17) – see https://reactnative.dev/docs/set-up-your-environment"
fi

# pnpm (README requirement 3)
section "pnpm"
if command -v pnpm >/dev/null 2>&1; then
  PNPM_VERSION=$(pnpm --version)
  PNPM_MAJOR=$(echo "$PNPM_VERSION" | cut -d. -f1)
  if is_integer "$PNPM_MAJOR" && [ "$PNPM_MAJOR" = "11" ]; then
    pass "pnpm $PNPM_VERSION"
  else
    fail "pnpm $PNPM_VERSION (required: 11.x) – see README"
  fi
else
  fail "pnpm not found (required: 11.x) – see README"
fi

# git-crypt installed + unlocked (README requirement 4 / setup step 3)
section "git-crypt"
if command -v git-crypt >/dev/null 2>&1; then
  pass "git-crypt installed"
  GIT_CRYPT_PROBE="$REPO_ROOT/env/atb/dev/google-services.json"
  if [ -f "$GIT_CRYPT_PROBE" ]; then
    if grep -q "GITCRYPT" "$GIT_CRYPT_PROBE" 2>/dev/null; then
      fail "git-crypt: repo is locked – see README"
    else
      pass "git-crypt: repo is unlocked"
    fi
  fi
else
  fail "git-crypt not found – see README"
fi

# --- Setup steps (README first time setup order) ---

# Entur JFrog npm registry (setup step 1)
section "Entur JFrog Registry (npm)"
NPMRC="$HOME/.npmrc"
if [ -f "$NPMRC" ] && grep -q "@entur-private:registry" "$NPMRC"; then
  pass "@entur-private:registry configured"
  if grep -q "entur2.jfrog.io.*_authToken" "$NPMRC"; then
    pass "JFrog auth token configured"
  else
    fail "JFrog auth token not configured – see README"
  fi
else
  fail "@entur-private:registry not configured – see README"
fi

# Entur JFrog Gradle registry (setup step 1)
section "Entur JFrog Registry (Gradle)"
GRADLE_PROPS="$HOME/.gradle/gradle.properties"
if [ -f "$GRADLE_PROPS" ] && grep -q "entur_artifactory_user" "$GRADLE_PROPS"; then
  pass "Gradle credentials configured"
else
  warn "Gradle credentials not configured – see README"
fi

# Bundler (setup step 2b – bundle install)
section "Bundler"
REQUIRED_BUNDLER=$(awk '/BUNDLED WITH/{getline; print $1}' "$REPO_ROOT/Gemfile.lock")
if command -v bundle >/dev/null 2>&1; then
  BUNDLER_VERSION=$(bundle --version | awk '{print $3}')
  if [ "$BUNDLER_VERSION" = "$REQUIRED_BUNDLER" ]; then
    pass "bundler $BUNDLER_VERSION"
  else
    fail "bundler $BUNDLER_VERSION (required: $REQUIRED_BUNDLER) – see README"
  fi
else
  fail "bundler not found (required: $REQUIRED_BUNDLER) – see README"
fi

# ImageMagick (setup step 2c)
section "ImageMagick"
if command -v magick >/dev/null 2>&1 || command -v convert >/dev/null 2>&1; then
  if command -v magick >/dev/null 2>&1; then
    IM_VERSION=$(magick --version 2>/dev/null | awk 'NR==1{print $3}')
  else
    IM_VERSION=$(convert --version 2>/dev/null | awk 'NR==1{print $3}')
  fi
  pass "imagemagick $IM_VERSION"
else
  fail "imagemagick not found – see README"
fi

# MapBox .netrc (setup step 4a – requires git-crypt unlock)
section "MapBox (.netrc)"
NETRC="$HOME/.netrc"
if [ -f "$NETRC" ] && grep -q "api.mapbox.com" "$NETRC"; then
  pass "MapBox credentials configured"
else
  fail "MapBox credentials not configured – see README"
fi

# App setup (setup step 5 – requires git-crypt unlock)
section "App setup (yarn setup dev <org>)"
if [ -f "$REPO_ROOT/.env" ] && [ -f "$REPO_ROOT/android/app/google-services.json" ] && [ -f "$REPO_ROOT/ios/atb/GoogleService-Info.plist" ]; then
  pass "app environment configured"
else
  fail "app environment not configured – see README"
fi

# iOS Certificates (setup step 6 – macOS only)
case "$OS" in Darwin)
  section "iOS Certificates (get_ios_certs)"
  IOS_CERT_COUNT=$(security find-identity -v -p codesigning 2>/dev/null | awk '/valid identit/{print $1}')
  if is_integer "$IOS_CERT_COUNT" && [ "$IOS_CERT_COUNT" -gt 0 ]; then
    pass "$IOS_CERT_COUNT codesigning identity/identities"
  else
    warn "no codesigning identities found – see README"
  fi
esac

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT))
printf "${BOLD}Results:${NC} %s checks — ${GREEN}%s passed${NC}, ${RED}%s failed${NC}, ${YELLOW}%s warnings${NC}\n" "$TOTAL" "$PASS_COUNT" "$FAIL_COUNT" "$WARN_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  printf "\n${RED}${BOLD}Environment is not ready.${NC} Fix the failing checks above.\n"
  exit 1
elif [ "$WARN_COUNT" -gt 0 ]; then
  printf "\n${YELLOW}${BOLD}Environment mostly ready.${NC} Review warnings above.\n"
  exit 0
else
  printf "\n${GREEN}${BOLD}Environment is ready!${NC} You should be able to build the app.\n"
  exit 0
fi
