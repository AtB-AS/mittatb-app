# Android Staging Build - Flow Graph

## High-level Job Flow

```mermaid
flowchart TD
    trigger["Trigger: push to master/release,
    schedule weekdays 01:00,
    workflow_dispatch"]

    trigger --> dc_decision{"force-build = true
    OR schedule?"}
    dc_decision -- Yes --> setup
    dc_decision -- No --> detect_changes

    subgraph detect_changes ["detect-changes - ubuntu-latest"]
        dc_checkout["Checkout
        fetch-depth: 2"]
        dc_detect["Detect changes
        .github/actions/detect-changes"]
        dc_checkout --> dc_detect
        dc_detect --> dc_out(["should_build: true/false"])
    end

    detect_changes --> should_build_check{"should_build
    != false?"}
    should_build_check -- No --> skip_all(["Build skipped"])
    should_build_check -- Yes --> setup

    subgraph setup ["setup - ubuntu-latest"]
        direction TB
        sm["Set org matrix
        from input or default"]
        sa["Set ABI
        from input or schedule default"]
        sm --> checkout_s["Checkout"]
        sa --> checkout_s

        checkout_s --> apktool_cache{"APKTool
        cache hit?
        lookup-only"}
        apktool_cache -- Miss --> install_apktool["Install APKTool 2.12.1"]
        apktool_cache -- Hit --> modules_cache

        install_apktool --> modules_cache{"node_modules
        cache hit?
        lookup-only"}

        modules_cache -- "Miss OR force-build" --> install_node_s["Install Node v22"]
        modules_cache -- "Hit AND not force-build" --> ruby_s

        install_node_s --> entur_s["Add Entur registry credentials"]
        entur_s --> yarn_s["yarn install --frozen-lockfile"]
        yarn_s --> ruby_s["Setup Ruby 3.1.0 + Bundler"]

        ruby_s --> setup_out(["Outputs:
        matrix, abi, abi-filename"])
    end

    setup --> build

    subgraph build ["build - ubuntu-latest - matrix: org x atb, nfk, fram, troms"]
        direction TB
        b_checkout["Checkout
        fetch-depth: 0"]

        b_checkout --> apk_cache_check{"force-build
        = true?"}
        apk_cache_check -- Yes --> apk_skip["APK cache step SKIPPED
        cache-hit = undefined"]
        apk_cache_check -- No --> apk_cache{"APK cache hit?"}

        apk_skip --> pre_build["Pre-build steps"]
        apk_cache --> pre_build

        pre_build --> version_name["Override version name
        set-version-name.sh"]
        version_name --> dep_changes["Detect dependency changes
        dorny/paths-filter"]
        dep_changes --> build_decision["Build decision"]
    end
```

## Pre-build Steps - composite action

The `can-skip` input is `true` when `force-build != true AND apk-cache hit`.

```mermaid
flowchart TD
    start(["Pre-build steps start
    can-skip derived from
    force-build + apk cache"])

    start --> can_skip{"can-skip?"}

    can_skip -- "false - fresh build" --> cleanup["Clean up runner
    Remove dotnet, haskell,
    codeql, docker, large pkgs"]
    can_skip -- "true - cached APK" --> env_vars

    cleanup --> env_vars["Set global env vars
    BUILD_ID, APP_ENVIRONMENT,
    KEYSTORE_PATH, JAVA_HOME, etc."]

    env_vars --> decrypt["Decrypt env files
    git-crypt-unlock.sh
    NOTE: uses brew install git-crypt"]

    decrypt --> entur["Add Entur registry credentials
    add-entur-private-registry.sh"]

    entur --> imagemagick["Install imagemagick
    apt-get install"]

    imagemagick --> node["Install Node v22"]

    node --> nm_cache{"node_modules
    cache hit?"}
    nm_cache -- Miss --> yarn["yarn install --frozen-lockfile"]
    nm_cache -- Hit --> ruby
    yarn --> ruby["Setup Ruby 3.1.0 + Bundler"]

    ruby --> set_env["Set environment
    override-environment.sh
    WARNING: uses macOS-only sed syntax"]

    set_env --> export_env["Export workflow env vars
    export-workflow-parameters.sh
    sources set-app-flavor.sh"]

    export_env --> override_config["Override native config files
    android/override-config-files.sh
    WARNING: uses brew install xmlstarlet"]

    override_config --> decode_ks["Decode Android keystore
    create-keystore-file.sh"]

    decode_ks --> can_skip2{"can-skip?"}

    can_skip2 -- "false - fresh build" --> gen_assets["Generate native assets
    yarn generate-native-assets"]
    can_skip2 -- "true - cached APK" --> done

    gen_assets --> gradle["Setup Gradle
    gradle/actions/setup-gradle@v5
    cache based on force-build flag"]

    gradle --> done(["Pre-build done"])
```

## Build Decision and Fastlane

```mermaid
flowchart TD
    dep_changes(["After dependency detection"])

    dep_changes --> should_build{"force-build = true
    OR apk cache miss?"}

    should_build -- Yes --> build_type{"output-type?"}
    should_build -- No --> apktool_path

    build_type -- AAB --> build_aab["fastlane android build_aab
    KEYSTORE_PASS, KEY_PASS,
    KEY_ALIAS, SKIP_CLEAN, ABI"]
    build_type -- "APK - default" --> build_apk["fastlane android build
    KEYSTORE_PASS, KEY_PASS,
    KEY_ALIAS, SKIP_CLEAN, ABI"]

    build_aab --> aab_check{"output-type = AAB?"}
    build_apk --> aab_check

    apktool_path --> restore_apktool["Restore APKTool cache
    Add to PATH"]
    restore_apktool --> aab_check

    aab_check -- "Yes - AAB" --> aab_done(["Build complete
    No distribution,
    no Bugsnag, no registration"])
    aab_check -- "No - APK" --> release_notes

    release_notes["Generate release notes
    generate-staging-release-notes.sh"]
    release_notes --> bugsnag_setup

    subgraph bugsnag_setup ["Setup Bugsnag CLI"]
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

    bugsnag_setup --> post_build
    post_build(["Post-build steps"])
```

## Post-build Steps - composite action

The `should-replace-bundle` input is `true` when `force-build != true AND apk-cache hit`.

```mermaid
flowchart TD
    start(["Post-build steps start"])

    start --> replace_check{"should-replace-bundle?"}

    replace_check -- "true - cached APK path" --> replace_bundle
    replace_check -- "false - fresh build" --> firebase

    subgraph replace_bundle ["Replace APK Bundle - replace-bundle.sh"]
        rb_bundle["Re-generate JS bundle
        npx react-native bundle"]
        rb_yq["brew install yq"]
        rb_framework["Install android-36 framework
        for APKTool
        WARNING: hardcoded android-36"]
        rb_decompile["Decompile APK
        apktool d"]
        rb_replace["Replace bundle in decompiled APK"]
        rb_version["Set version code + name
        yq edit apktool.yml"]
        rb_recompile["Re-compile APK
        apktool b"]
        rb_align["zipalign APK
        WARNING: hardcoded build-tools 36.0.0"]
        rb_sign["Re-sign APK with apksigner
        WARNING: hardcoded build-tools 36.0.0"]

        rb_bundle --> rb_yq --> rb_framework --> rb_decompile
        rb_decompile --> rb_replace --> rb_version
        rb_version --> rb_recompile --> rb_align --> rb_sign
    end

    replace_bundle --> firebase

    firebase["Distribute to Firebase
    base64 decode credentials to json
    fastlane android firebase_distribution_staging"]

    firebase --> bugsnag_upload

    subgraph bugsnag_upload ["Upload Bugsnag Symbols"]
        bs_set["Set BUNDLE_PATH + SOURCEMAP_PATH
        based on APP_FLAVOR + APP_ENVIRONMENT"]
        bs_sourcemaps["Upload JS sourcemaps
        upload-sourcemaps.sh via bugsnag-cli"]
        bs_native_check{"skip-native?
        equals should-replace-bundle"}
        bs_ndk["Upload NDK symbols
        upload-ndk.sh via bugsnag-cli"]
        bs_proguard["Upload Proguard mappings
        upload-proguard.sh via bugsnag-cli
        WARNING: expects android/app/bundle/mapping.txt"]
        bs_skip_native(["NDK + Proguard skipped"])

        bs_set --> bs_sourcemaps --> bs_native_check
        bs_native_check -- "false - fresh build" --> bs_ndk --> bs_proguard
        bs_native_check -- "true - cached APK" --> bs_skip_native
    end

    bugsnag_upload --> register["Register app version
    register-app-version.sh
    Entur MobileApplicationRegistryService"]

    register --> done(["Build complete"])
```

## Two Main Paths Summary

```mermaid
flowchart LR
    subgraph fresh ["Path A: Fresh Build - force-build=true OR no APK cache"]
        direction TB
        f1["Clean up runner"] --> f2["Full pre-build setup"]
        f2 --> f3["Generate native assets"]
        f3 --> f4["Setup Gradle"]
        f4 --> f5["Fastlane build APK or AAB"]
        f5 --> f6["Generate release notes"]
        f6 --> f7["Firebase distribution"]
        f7 --> f8["Bugsnag: sourcemaps + NDK + Proguard"]
        f8 --> f9["Register app version"]
    end

    subgraph cached ["Path B: Cached APK - force-build=false AND APK cache hit"]
        direction TB
        c1["Skip runner cleanup"] --> c2["Pre-build setup
        skip native assets + Gradle"]
        c2 --> c3["Restore APKTool from cache"]
        c3 --> c4["Replace JS bundle in APK
        decompile, replace, recompile, re-sign"]
        c4 --> c5["Generate release notes"]
        c5 --> c6["Firebase distribution"]
        c6 --> c7["Bugsnag: sourcemaps only
        NDK + Proguard skipped"]
        c7 --> c8["Register app version"]
    end
```

## Trigger Conditions Reference

| Trigger | force-build | detect-changes runs? | inputs.org | inputs.abi | inputs.output-type |
|---------|------------|---------------------|------------|-----------|-------------------|
| push to master/release | N/A - empty | Yes | default: all 4 | default fallback: arm64-v8a, armeabi-v7a | default: APK |
| schedule - cron | N/A - empty | No - skipped | default: all 4 | hardcoded: all 4 ABIs | default: APK |
| workflow_dispatch force=false | false | Yes | user input | user input | user input |
| workflow_dispatch force=true | true | No - skipped | user input | user input | user input |

## Key Environment Variables Flow

```mermaid
flowchart LR
    subgraph sources ["Sources"]
        env_file[".env file
        per org and environment"]
        scripts["export-workflow-parameters.sh"]
        pre_build_action["pre-build action
        Set global env vars step"]
    end

    subgraph vars ["Key Variables"]
        BUILD_ID["BUILD_ID
        date +%s"]
        APP_ENVIRONMENT["APP_ENVIRONMENT
        = staging"]
        APP_VERSION["APP_VERSION
        from .env, overridden
        by set-version-name.sh"]
        APP_FLAVOR["APP_FLAVOR
        app or beacons
        from KETTLE_API_KEY"]
        KEYSTORE_PATH["KEYSTORE_PATH
        ./android/app/keystore.jks"]
    end

    subgraph consumers ["Consumers"]
        fastlane["Fastlane build"]
        replace["replace-bundle.sh"]
        bugsnag["Bugsnag uploads"]
        register["register-app-version.sh"]
    end

    pre_build_action --> BUILD_ID & APP_ENVIRONMENT & KEYSTORE_PATH
    env_file --> scripts --> APP_VERSION & APP_FLAVOR
    BUILD_ID & APP_VERSION --> fastlane & replace & bugsnag & register
    APP_FLAVOR & APP_ENVIRONMENT --> bugsnag & replace
    KEYSTORE_PATH --> replace
```
