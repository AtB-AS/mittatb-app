# iOS Staging Build - Flow Graph

## High-level Job Flow

```mermaid
flowchart TD
    trigger["Trigger: push to master/release,
    schedule weekdays 01:00,
    workflow_dispatch"]

    trigger --> detect_changes

    subgraph detect_changes ["detect-changes - ubuntu-latest"]
        force_check{"force-build = true
        OR schedule?"}
        force_check -- Yes --> force_build(["should_build: true
        skip checkout + detection"])
        force_check -- No --> dc_checkout["Checkout
        fetch-depth: 2"]
        dc_checkout --> dc_detect["Detect changes
        .github/actions/detect-changes"]
        dc_detect --> dc_out(["should_build: true/false"])
    end

    detect_changes --> should_build_check{"should_build
    != false?"}
    should_build_check -- No --> skip_all(["Build skipped"])
    should_build_check -- Yes --> setup

    subgraph setup ["setup - macOS-26"]
        direction TB
        sm["Set org matrix
        from input or default"]
        sm --> checkout_s["Checkout"]

        checkout_s --> pods_cache_s{"Pods cache hit?
        lookup-only"}
        pods_cache_s --> modules_cache_s{"node_modules
        cache hit?
        lookup-only"}

        modules_cache_s -- "Miss OR force-build" --> install_node_s["Install Node v22"]
        modules_cache_s -- "Hit AND not force-build" --> entur_check

        install_node_s --> entur_check{"node_modules
        cache hit?"}

        entur_check -- Miss --> entur_s["Add Entur registry credentials"]
        entur_check -- Hit --> yarn_check

        entur_s --> yarn_check{"force-build = true
        OR cache miss?"}

        yarn_check -- Yes --> yarn_s["yarn install --frozen-lockfile"]
        yarn_check -- No --> ruby_s

        yarn_s --> ruby_s["Setup Ruby 3.1.0 + Bundler"]

        ruby_s --> xcode_check{"force-build = true
        OR pods cache miss?"}
        xcode_check -- Yes --> xcode_s["Setup Xcode
        latest-stable"]
        xcode_check -- No --> setup_out

        xcode_s --> pods_install["Install CocoaPods
        bundle exec pod install"]
        pods_install --> setup_out(["Output: matrix"])
    end

    setup --> build_ios

    subgraph build_ios ["build-ios - macOS-26 - matrix: org x atb, nfk, fram, troms"]
        direction TB
        b_checkout["Checkout"]
        b_checkout --> ipa_check{"force-build = true?"}
        ipa_check -- Yes --> ipa_skip["IPA cache step SKIPPED
        cache-hit = undefined"]
        ipa_check -- No --> ipa_cache{"IPA + dSYM
        cache hit?"}

        ipa_skip --> ios_build_setup["iOS build setup
        composite action
        skip-heavy-steps based on cache"]
        ipa_cache --> ios_build_setup

        ios_build_setup --> build_path["Build path decision"]
    end
```

## iOS Build Setup - composite action

```mermaid
flowchart TD
    start(["ios-build-setup start"])

    start --> env_vars["Set global env vars
    BUILD_ID, APP_ENVIRONMENT"]

    env_vars --> decrypt["Decrypt env files
    git-crypt-unlock.sh
    uses brew install git-crypt"]

    decrypt --> entur["Add Entur registry credentials
    add-entur-private-registry.sh"]

    entur --> node["Install Node v22"]

    node --> ruby["Setup Ruby 3.1.0 + Bundler"]

    ruby --> nm_check{"force-build = true?"}

    nm_check -- Yes --> yarn_install["yarn install --frozen-lockfile"]
    nm_check -- No --> nm_cache{"node_modules
    cache hit?"}

    nm_cache -- Miss --> yarn_install
    nm_cache -- Hit --> xcode

    yarn_install --> xcode["Setup Xcode version
    default: latest-stable"]

    xcode --> netrc["Copy .netrc
    for Mapbox API token"]

    netrc --> set_env["Set environment
    override-environment.sh
    copies .env, icons, google-services, etc."]

    set_env --> export_env["Export workflow env vars
    export-workflow-parameters.sh
    sets APP_VERSION, APP_FLAVOR, etc."]

    export_env --> override_config["Override native config files
    ios/override-config-files.sh
    updates Info.plist reCAPTCHA URL schemes"]

    override_config --> ssh_agent["Setup SSH agent
    for Match private key"]

    ssh_agent --> heavy_check{"skip-heavy-steps
    = true?"}

    heavy_check -- No --> gen_assets["Generate native assets
    remove Python symlinks
    brew install imagemagick
    yarn generate-native-assets"]

    gen_assets --> done(["ios-build-setup done"])
    heavy_check -- Yes --> done
```

## Build Path Decision

```mermaid
flowchart TD
    setup_done(["After ios-build-setup"])

    setup_done --> pods_restore{"IPA cache hit?"}

    pods_restore -- "Miss or skipped" --> restore_pods["Restore Pods cache"]
    pods_restore -- "Hit" --> widget_skip

    restore_pods --> widget_check{"ENABLE_WIDGET != true
    AND IPA cache miss?"}

    widget_check -- Yes --> disable_widget["Disable widget
    configure_extensions remove"]
    widget_check -- No --> fastlane_build

    disable_widget --> fastlane_build["Fastlane build
    bundle exec fastlane ios build
    EXPORT_METHOD: ad-hoc
    SKIP_PODS based on pods cache"]

    fastlane_build --> release_notes

    widget_skip["Skip widget
    native code unchanged"] --> cert_match

    cert_match["Fastlane cert match only
    bundle exec fastlane ios get_certs
    MATCH_PASSWORD, KEYCHAIN_NAME"]

    cert_match --> replace_bundle

    replace_bundle --> release_notes

    release_notes["Generate release notes
    generate-staging-release-notes.sh"]
```

## Replace IPA Bundle - cached path

When the IPA is cached, the JS bundle is regenerated and re-injected into the cached IPA.

```mermaid
flowchart TD
    start(["replace-bundle.sh start
    requires: IPA_FILE_NAME, APP_NAME,
    IOS_CODE_SIGN_IDENTITY, BUILD_ID,
    MATCH_PASSWORD, KEYCHAIN_NAME"])

    start --> regen["Re-generate JS bundle
    npx react-native bundle
    outputs: bundle/main.jsbundle
    and bundle/main.jsbundle.map"]

    regen --> unzip["Unzip cached IPA"]

    unzip --> del_sig["Delete old code signature"]

    del_sig --> replace["Replace main.jsbundle
    in Payload"]

    replace --> set_version["Set CFBundleVersion
    to BUILD_ID via plutil"]

    set_version --> keychain["Setup keychain
    list, unlock, set default"]

    keychain --> entitlements["Extract entitlements
    from existing app via codesign"]

    entitlements --> resign["Re-sign Payload
    codesign with IOS_CODE_SIGN_IDENTITY"]

    resign --> repack["Re-zip into IPA"]

    repack --> verify["Verify code signature integrity"]

    verify --> done(["replace-bundle.sh done"])
```

## Distribution and Bugsnag Upload

```mermaid
flowchart TD
    release_notes(["After release notes generated"])

    release_notes --> firebase["Distribute to Firebase
    base64 decode credentials to json
    fastlane ios firebase_distribution_staging
    FIREBASE_APP_ID_IOS"]

    firebase --> bugsnag_cli_setup

    subgraph bugsnag_cli_setup ["Setup Bugsnag CLI"]
        bs_detect["Detect OS + arch"]
        bs_cache{"Bugsnag CLI
        cache hit?"}
        bs_install["Install Bugsnag CLI v3.7.0
        curl install script from GitHub"]
        bs_verify["Verify installation"]
        bs_path["Add to PATH"]

        bs_detect --> bs_cache
        bs_cache -- Miss --> bs_install --> bs_verify
        bs_cache -- Hit --> bs_verify
        bs_verify --> bs_path
    end

    bugsnag_cli_setup --> bugsnag_upload

    subgraph bugsnag_upload ["Upload Bugsnag Symbols - ios-upload-bugsnag"]
        sm_check{"skip-create-sourcemaps?
        true when cached IPA"}
        sm_check -- "false - fresh build" --> create_sm["Create sourcemaps
        create-sourcemaps.sh
        npx react-native bundle"]
        sm_check -- "true - cached IPA" --> upload_sm

        create_sm --> upload_sm["Upload JS sourcemaps
        upload-sourcemaps.sh
        bugsnag-cli upload
        APP_VERSION, BUILD_ID"]

        upload_sm --> dsym_check{"skip-dsyms?
        true when cached IPA"}

        dsym_check -- "false - fresh build" --> upload_dsym["Upload dSYMs
        upload-dsyms.sh
        bugsnag-cli upload xcode-build
        AtB.app.dSYM.zip"]
        dsym_check -- "true - cached IPA" --> dsym_skip(["dSYM upload skipped
        native code unchanged"])

        upload_dsym --> bugsnag_done(["Bugsnag upload done"])
    end

    dsym_skip --> register
    bugsnag_done --> register

    register["Register app version
    register-app-version.sh
    Entur MobileApplicationRegistryService
    IOS_BUNDLE_IDENTIFIER, APP_VERSION"]

    register --> done(["Build complete"])
```

## Two Main Paths Summary

```mermaid
flowchart LR
    subgraph fresh ["Path A: Fresh Build - force-build=true OR no IPA cache"]
        direction TB
        f1["ios-build-setup: node, ruby, xcode,
        entur, ssh-agent, native assets"] --> f2["Disable widget
        if applicable"]
        f2 --> f3["Fastlane ios build
        ad-hoc export"]
        f3 --> f4["Generate release notes"]
        f4 --> f5["Firebase distribution"]
        f5 --> f6["Bugsnag: create + upload sourcemaps
        + upload dSYMs"]
        f6 --> f7["Register app version"]
    end

    subgraph cached ["Path B: Cached IPA - force-build=false AND IPA cache hit"]
        direction TB
        c1["ios-build-setup: node, ruby, xcode,
        entur, ssh-agent
        skip native assets"] --> c2["Fastlane cert match only
        get signing certs"]
        c2 --> c3["Replace IPA bundle
        regen JS, unzip, replace,
        re-sign, re-zip"]
        c3 --> c4["Generate release notes"]
        c4 --> c5["Firebase distribution"]
        c5 --> c6["Bugsnag: upload sourcemaps only
        skip dSYMs"]
        c6 --> c7["Register app version"]
    end
```

## Trigger Conditions Reference

| Trigger | force-build | detect-changes behavior | inputs.org |
|---------|------------|------------------------|------------|
| push to master/release | N/A - empty | Runs full detection | default: all 4 orgs |
| schedule - cron | N/A - empty | Short-circuits to should_build=true | default: all 4 orgs |
| workflow_dispatch force=false | false | Runs full detection | user input |
| workflow_dispatch force=true | true | Short-circuits to should_build=true | user input |

## Key Environment Variables Flow

```mermaid
flowchart LR
    subgraph sources ["Sources"]
        env_file[".env file
        per org and environment"]
        scripts["export-workflow-parameters.sh"]
        build_setup["ios-build-setup action
        Set global env vars step"]
        workflow["workflow env block
        KEYCHAIN_NAME = CI"]
    end

    subgraph vars ["Key Variables"]
        BUILD_ID["BUILD_ID
        date +%s"]
        APP_ENVIRONMENT["APP_ENVIRONMENT
        = staging"]
        APP_VERSION["APP_VERSION
        from .env"]
        IOS_BUNDLE_IDENTIFIER["IOS_BUNDLE_IDENTIFIER
        from .env"]
        IOS_CODE_SIGN_IDENTITY["IOS_CODE_SIGN_IDENTITY
        from .env"]
        KEYCHAIN_NAME["KEYCHAIN_NAME
        = CI"]
        ENABLE_WIDGET["ENABLE_WIDGET
        from .env"]
    end

    subgraph consumers ["Consumers"]
        fastlane["Fastlane build"]
        replace["replace-bundle.sh"]
        bugsnag["Bugsnag uploads"]
        register["register-app-version.sh"]
        widget["Widget config"]
    end

    build_setup --> BUILD_ID & APP_ENVIRONMENT
    workflow --> KEYCHAIN_NAME
    env_file --> scripts --> APP_VERSION & IOS_BUNDLE_IDENTIFIER & IOS_CODE_SIGN_IDENTITY & ENABLE_WIDGET

    BUILD_ID & APP_VERSION --> fastlane & replace & bugsnag & register
    IOS_CODE_SIGN_IDENTITY & KEYCHAIN_NAME --> fastlane & replace
    IOS_BUNDLE_IDENTIFIER --> register
    ENABLE_WIDGET --> widget
```

## IPA Cache Key Components

The IPA cache key determines whether a fresh build or bundle replacement occurs:

```
key: {org}-ipa-app-ios-cache-{hash ios/**}-{hash .yalc/**}-{hash .env}-{hash assets*/}
```

| Component | What it captures |
|-----------|-----------------|
| org | Per-organization cache separation |
| ios/** | Any change to native iOS code, Podfile, xcodeproj, etc. |
| .yalc/** | Local package overrides |
| .env | Environment configuration changes |
| assets*/ | Asset directory changes |

If any of these change, the IPA cache misses and a fresh build is triggered.
