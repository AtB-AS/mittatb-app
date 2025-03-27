source 'https://rubygems.org'

# install correct ruby version with rbenv, which can be installed with brew install rbenv
ruby '3.1.0'

gem "fastlane", "2.226.0"
gem "dotenv"
# Cocoapods 1.15 introduced a bug which break the build. We will remove the upper
# bound in the template on Cocoapods with next React Native release.
gem 'cocoapods', '>= 1.13', '< 1.15'
gem 'activesupport', '>= 6.1.7.5', '< 7.1.0'
gem "configure_extensions"

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
