require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "entur-react-native-traveller"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/entur/.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.dependency "React-Core"
  useVendoredFramework = !$DontUseVendoredAbtMobile

  s.swift_version = '5.0'

  if useVendoredFramework
    s.dependency "SwiftProtobuf"
    s.dependency "CryptoSwift"
    s.dependency "Kronos"
    s.ios.vendored_frameworks = 'AbtMobile.xcframework'
  else
    s.dependency "AbtMobile"
  end
end
