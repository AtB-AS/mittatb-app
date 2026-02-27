# Android Staging Build - Flow Graph

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

        apk_skip --> build_setup["Build setup
        android-build-setup action"]
        apk_cache --> build_setup
    end
```

## Build Setup - shared composite action

The `skip-heavy-steps` input is `true` when `force-build != true AND apk-cache hit`.
This action is shared between staging and store builds.

```mermaid
flowchart TD
    start(["android-build-setup start
    inputs: app-environment, org,
    git-crypt-key, keystore,
    entur credentials, skip-heavy-steps"])

    start --> heavy_check1{"skip-heavy-steps?"}

    heavy_check1 -- "false" --> cleanup["Clean up runner
    Remove dotnet, haskell,
    codeql, docker, large pkgs"]
    heavy_check1 -- "true" --> env_vars

    cleanup --> env_vars["Set global env vars
    BUILD_ID, APP_ENVIRONMENT,
    KEYSTORE_PATH, APK/AAB_FILE_NAME,
    JAVA_HOME, linuxbrew PATH"]

    env_vars --> decrypt["Decrypt env files
    git-crypt-unlock.sh"]

    decrypt --> entur["Add Entur registry credentials
    add-entur-private-registry.sh"]

    entur --> heavy_check2{"skip-heavy-steps?"}
    heavy_check2 -- "false" --> imagemagick["Install imagemagick
    apt-get install"]
    heavy_check2 -- "true" --> node

    imagemagick --> node["Install Node v22
    with yarn cache"]

    node --> yarn["yarn install --frozen-lockfile"]

    yarn --> ruby["Setup Ruby 3.1.0 + Bundler"]

    ruby --> set_env["Set environment
    override-environment.sh"]

    set_env --> export_env["Export workflow env vars
    export-workflow-parameters.sh"]

    export_env --> override_config["Override native config files
    android/override-config-files.sh"]

    override_config --> decode_ks["Decode Android keystore
    create-keystore-file.sh"]

    decode_ks --> heavy_check3{"skip-heavy-steps?"}

    heavy_check3 -- "false" --> gen_assets["Generate native assets
    yarn generate-native-assets"]
    heavy_check3 -- "true" --> done

    gen_assets --> done(["android-build-setup done"])
```

## Build Steps After Setup

```mermaid
flowchart TD
    setup_done(["After android-build-setup"])

    setup_done --> gradle_check{"force-build = true
    OR apk cache miss?"}

    gradle_check -- Yes --> gradle["Setup Gradle
    gradle/actions/setup-gradle@v5
    cache based on force-build flag"]
    gradle_check -- No --> dep_changes

    gradle --> dep_changes["Detect dependency changes
    dorny/paths-filter
    (always runs)"]

    dep_changes --> should_build{"force-build = true
    OR apk cache miss?"}

    should_build -- Yes --> build_type{"output-type?"}
    should_build -- No --> apktool_restore

    build_type -- AAB --> build_aab["fastlane android build_aab
    KEYSTORE_PASS, KEY_PASS,
    KEY_ALIAS, SKIP_CLEAN, ABI"]
    build_type -- "APK - default" --> build_apk["fastlane android build
    KEYSTORE_PASS, KEY_PASS,
    KEY_ALIAS, SKIP_CLEAN, ABI"]

    apktool_restore["Restore APKTool cache
    Add to PATH
    (only when NOT AAB, NOT force-build, AND cache hit)"]

    build_aab --> aab_check{"output-type = AAB?"}
    build_apk --> aab_check
    apktool_restore --> aab_check

    aab_check -- "Yes - AAB" --> aab_done(["Build complete
    No distribution,
    no Bugsnag, no registration"])
    aab_check -- "No - APK" --> release_notes

    release_notes["Generate release notes
    generate-staging-release-notes.sh"]

    release_notes --> bugsnag_cli_setup

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

    bugsnag_cli_setup --> post_build_steps
    post_build_steps(["Post-build steps"])
```

## Post-build Steps

These steps are now inline in the workflow, not in a separate composite action.

```mermaid
flowchart TD
    start(["Post-build steps start"])

    start --> replace_check{"force-build != true
    AND apk cache hit?"}

    replace_check -- "true - cached APK" --> replace_bundle
    replace_check -- "false - fresh build" --> firebase

    subgraph replace_bundle ["Replace APK Bundle - replace-bundle.sh"]
        rb_bundle["Re-generate JS bundle
        npx react-native bundle"]
        rb_yq["brew install yq"]
        rb_framework["Install android-36 framework
        for APKTool"]
        rb_decompile["Decompile APK
        apktool d"]
        rb_replace["Replace bundle in decompiled APK"]
        rb_version["Set version code + name
        yq edit apktool.yml"]
        rb_recompile["Re-compile APK
        apktool b"]
        rb_align["zipalign APK
        build-tools 36.0.0"]
        rb_sign["Re-sign APK with apksigner
        build-tools 36.0.0"]

        rb_bundle --> rb_yq --> rb_framework --> rb_decompile
        rb_decompile --> rb_replace --> rb_version
        rb_version --> rb_recompile --> rb_align --> rb_sign
    end

    replace_bundle --> firebase

    firebase["Distribute to Firebase
    base64 decode credentials to json
    fastlane android firebase_distribution_staging"]

    firebase --> bugsnag_upload

    subgraph bugsnag_upload ["Upload Bugsnag Symbols - android-upload-bugsnag action"]
        bs_set["Set BUNDLE_PATH + SOURCEMAP_PATH
        based on APP_FLAVOR + APP_ENVIRONMENT"]
        bs_sourcemaps["Upload JS sourcemaps
        upload-sourcemaps.sh via bugsnag-cli"]
        bs_skip_native(["NDK + Proguard skipped
        skip-native=true always on staging"])

        bs_set --> bs_sourcemaps --> bs_skip_native
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
        f1["android-build-setup
        full run incl. cleanup,
        imagemagick, native assets"] --> f2["Setup Gradle"]
        f2 --> f3["Fastlane build APK or AAB"]
        f3 --> f4["Generate release notes"]
        f4 --> f5["Setup Bugsnag CLI"]
        f5 --> f6["Firebase distribution"]
        f6 --> f7["Bugsnag: sourcemaps only
        NDK + Proguard skipped"]
        f7 --> f8["Register app version"]
    end

    subgraph cached ["Path B: Cached APK - force-build=false AND APK cache hit"]
        direction TB
        c1["android-build-setup
        skip-heavy-steps=true
        skip cleanup, imagemagick,
        native assets"] --> c2["Restore APKTool from cache"]
        c2 --> c3["Generate release notes"]
        c3 --> c4["Setup Bugsnag CLI"]
        c4 --> c5["Replace APK bundle
        decompile, replace, recompile, re-sign"]
        c5 --> c6["Firebase distribution"]
        c6 --> c7["Bugsnag: sourcemaps only
        NDK + Proguard skipped"]
        c7 --> c8["Register app version"]
    end
```

## Trigger Conditions Reference

| Trigger | force-build | detect-changes behavior | inputs.org | inputs.abi | inputs.output-type |
|---------|------------|------------------------|------------|-----------|-------------------|
| push to master/release | N/A - empty | Runs full detection | default: all 4 | default fallback: arm64-v8a, armeabi-v7a | default: APK |
| schedule - cron | N/A - empty | Short-circuits to should_build=true | default: all 4 | hardcoded: all 4 ABIs | default: APK |
| workflow_dispatch force=false | false | Runs full detection | user input | user input | user input |
| workflow_dispatch force=true | true | Short-circuits to should_build=true | user input | user input | user input |

## Key Environment Variables Flow

```mermaid
flowchart LR
    subgraph sources ["Sources"]
        env_file[".env file
        per org and environment"]
        scripts["export-workflow-parameters.sh"]
        build_setup["android-build-setup action
        Set global env vars step"]
    end

    subgraph vars ["Key Variables"]
        BUILD_ID["BUILD_ID
        date +%s"]
        APP_ENVIRONMENT["APP_ENVIRONMENT
        = staging"]
        APP_VERSION["APP_VERSION
        from .env"]
        APP_FLAVOR["APP_FLAVOR
        always 'app'"]
        KEYSTORE_PATH["KEYSTORE_PATH
        ./android/app/keystore.jks"]
    end

    subgraph consumers ["Consumers"]
        fastlane["Fastlane build"]
        replace["replace-bundle.sh"]
        bugsnag["Bugsnag uploads"]
        register["register-app-version.sh"]
    end

    build_setup --> BUILD_ID & APP_ENVIRONMENT & KEYSTORE_PATH
    env_file --> scripts --> APP_VERSION & APP_FLAVOR
    BUILD_ID & APP_VERSION --> fastlane & replace & bugsnag & register
    APP_FLAVOR & APP_ENVIRONMENT --> bugsnag & replace
    KEYSTORE_PATH --> replace
```
