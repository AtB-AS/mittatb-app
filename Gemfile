source 'https://rubygems.org'

# install correct ruby version with rbenv, which can be installed with brew install rbenv
ruby '3.1.0'

gem 'bundler', '~> 2.6.5'

gem "fastlane"
gem "dotenv"
# Exclude problematic versions of cocoapods and active support that causes build failures.
gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
gem 'cocoapods-patch', '~> 1.3.0'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
gem 'xcodeproj', '< 1.26.0'
gem 'concurrent-ruby', '< 1.3.4'
gem 'configure_extensions'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
