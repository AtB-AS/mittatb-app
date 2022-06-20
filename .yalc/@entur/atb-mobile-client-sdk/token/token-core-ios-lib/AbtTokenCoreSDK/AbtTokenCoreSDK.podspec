Pod::Spec.new do |s|
  s.name         = "AbtTokenCoreSDK"
  s.version      = "1.0.0"
  s.summary      = "Swift-implementation of abt-mobile (token-lib)"
  s.homepage     = "https://github.com/entur/"
  s.license      = "EUPLv12"
  s.authors      = "Entur"

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/entur/.git", :tag => "#{s.version}" }

  s.source_files = "**/*.{h,m,mm,swift}"
  s.dependency "SwiftProtobuf"
  s.dependency "Kronos"
end
