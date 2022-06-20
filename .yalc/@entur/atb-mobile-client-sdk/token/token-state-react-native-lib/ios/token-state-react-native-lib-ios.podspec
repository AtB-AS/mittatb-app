require "json"

mainPackage = JSON.parse(File.read(File.join(__dir__, "../../../package.json")))
projectPackage = JSON.parse(File.read(File.join(__dir__, "../package.json")))

Pod::Spec.new do |s|
  s.name         = "token-state-react-native-lib-ios"
  s.version      = projectPackage["version"]
  s.summary      = projectPackage["description"]
  s.homepage     = mainPackage["homepage"]
  s.license      = mainPackage["license"]
  s.authors      = mainPackage["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/entur/.git", :tag => "#{s.version}" }

  s.source_files = "**/*.{h,m,mm,swift}"
  s.dependency "React-Core"
  useVendoredFramework = !$DontUseVendoredAbtMobile

  s.swift_version = '5.0'

  if useVendoredFramework
    s.dependency "Kronos"
    s.dependency "SwiftProtobuf"
    s.ios.vendored_frameworks = "AbtTokenCoreSDK.xcframework"
  else
    s.dependency "AbtTokenCoreSDK"
  end
end
