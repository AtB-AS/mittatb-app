source 'https://rubygems.org'

# install correct ruby version with rbenv, which can be installed with brew install rbenv
ruby '3.1.0'

gem 'bundler', '~> 2.6.5'

gem 'fastlane'
gem "dotenv"
# Exclude problematic versions of cocoapods and active support that causes build failures.
gem 'cocoapods', '~> 1.16.2'
gem 'cocoapods-patch', '~> 1.3.0'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
gem 'xcodeproj', '~> 1.27.0'
gem 'concurrent-ruby', '< 1.3.4'
gem 'configure_extensions'

# Ruby 3.4.0 has removed some libraries from the standard library.
gem 'bigdecimal'
gem 'logger'
gem 'benchmark'
gem 'mutex_m'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
