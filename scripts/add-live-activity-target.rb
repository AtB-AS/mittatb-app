#!/usr/bin/env ruby
# Adds the `liveActivity` widget-extension target to ios/atb.xcodeproj.
# Idempotent: re-running is a no-op if the target already exists.
# Models settings on the existing `departureWidget` extension.

require "xcodeproj"

PROJECT = "atb.xcodeproj"
TARGET_NAME = "liveActivity"
GROUP_PATH = "liveActivity"

WIDGET_SWIFT = %w[
  TransitTheme.swift
  TransitLockScreenView.swift
  TransitLiveActivity.swift
  LiveActivityBundle.swift
]
SHARED_SWIFT = "TransitActivityAttributes.swift" # app + extension
INFO_PLIST = "Info.plist"

proj = Xcodeproj::Project.open(PROJECT)

if proj.targets.any? { |t| t.name == TARGET_NAME }
  puts "== '#{TARGET_NAME}' already exists — nothing to do."
  exit 0
end

app = proj.targets.find { |t| t.name == "app" } or abort("no 'app' target")
dw  = proj.targets.find { |t| t.name == "departureWidget" } or abort("no departureWidget")

# --- 1. Create the widget-extension target -----------------------------------
la = proj.new_target(:app_extension, TARGET_NAME, :ios, "16.6")
puts "== created target #{la.name} (#{la.product_type})"

# --- 2. Build settings: clone departureWidget's, then override ---------------
config_xcconfig = dw.build_configurations.first.base_configuration_reference
la.build_configurations.each do |cfg|
  src = dw.build_configurations.find { |c| c.name == cfg.name }
  cfg.build_settings = Marshal.load(Marshal.dump(src.build_settings)) # deep copy
  cfg.base_configuration_reference = config_xcconfig

  cfg.build_settings["INFOPLIST_FILE"] = "#{GROUP_PATH}/Info.plist"
  cfg.build_settings["PRODUCT_BUNDLE_IDENTIFIER"] = "$(IOS_APP_WIDGET_IDENTIFIER).liveactivity"
  # Mirror departureWidget/AtbAppIntent: hardcode a Development profile only for
  # local Debug device builds; leave Release empty so Fastlane injects the
  # distribution profile at CI time.
  if cfg.name == "Debug"
    cfg.build_settings["PROVISIONING_PROFILE_SPECIFIER"] =
      "match Development $(IOS_APP_WIDGET_IDENTIFIER).liveactivity"
    cfg.build_settings["PROVISIONING_PROFILE_SPECIFIER[sdk=iphoneos*]"] =
      "match Development $(IOS_APP_WIDGET_IDENTIFIER).liveactivity"
  else
    cfg.build_settings["PROVISIONING_PROFILE_SPECIFIER"] = ""
    cfg.build_settings.delete("PROVISIONING_PROFILE_SPECIFIER[sdk=iphoneos*]")
  end
  cfg.build_settings["INFOPLIST_KEY_CFBundleDisplayName"] = "AtB Live Activity"
  cfg.build_settings["PRODUCT_NAME"] = "$(TARGET_NAME)"
  cfg.build_settings["CODE_SIGN_ENTITLEMENTS"] =
    (cfg.name == "Debug" ? "liveActivityDebug.entitlements" : "liveActivity.entitlements")

  # No asset catalog in this extension.
  cfg.build_settings.delete("ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME")
  cfg.build_settings.delete("ASSETCATALOG_COMPILER_WIDGET_BACKGROUND_COLOR_NAME")

  puts "   [#{cfg.name}] bundle=#{cfg.build_settings["PRODUCT_BUNDLE_IDENTIFIER"]} " \
       "deploy=#{cfg.build_settings["IPHONEOS_DEPLOYMENT_TARGET"]} " \
       "entitlements=#{cfg.build_settings["CODE_SIGN_ENTITLEMENTS"]}"
end

# --- 3. Group + source files -------------------------------------------------
group = proj.main_group.new_group(TARGET_NAME, GROUP_PATH)

# Widget-only Swift -> extension target
WIDGET_SWIFT.each do |name|
  ref = group.new_file(name)
  la.source_build_phase.add_file_reference(ref, true)
  puts "   +extension source: #{name}"
end

# Shared attributes -> BOTH extension and app targets
shared_ref = group.new_file(SHARED_SWIFT)
la.source_build_phase.add_file_reference(shared_ref, true)
app.source_build_phase.add_file_reference(shared_ref, true)
puts "   +shared source (app+extension): #{SHARED_SWIFT}"

# Info.plist -> reference only (not compiled)
group.new_file(INFO_PLIST)
puts "   +Info.plist reference (not compiled)"

# --- 4. Entitlements references (top-level, not compiled) --------------------
%w[liveActivity.entitlements liveActivityDebug.entitlements].each do |ent|
  unless proj.main_group.files.any? { |f| f.display_name == ent }
    proj.main_group.new_file(ent)
    puts "   +entitlements reference: #{ent}"
  end
end

# --- 5. System frameworks (belt-and-suspenders; Swift autolinks anyway) ------
begin
  la.add_system_frameworks(%w[SwiftUI WidgetKit])
  puts "   +linked SwiftUI, WidgetKit"
rescue => e
  puts "   (skipped explicit framework link: #{e.message})"
end

# --- 6. Embed the .appex into the app + declare dependency -------------------
embed = app.build_phases.find { |ph| (ph.display_name rescue "") == "Embed Foundation Extensions" }
abort("no 'Embed Foundation Extensions' phase") unless embed
unless embed.files.any? { |bf| bf.display_name == "#{TARGET_NAME}.appex" }
  bf = embed.add_file_reference(la.product_reference, true)
  bf.settings = { "ATTRIBUTES" => ["RemoveHeadersOnCopy"] }
  puts "   +embedded #{TARGET_NAME}.appex"
end
app.add_dependency(la)
puts "   +app depends on #{TARGET_NAME}"

# --- 7. Save -----------------------------------------------------------------
proj.save
puts "== saved #{PROJECT}"
