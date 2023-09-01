source 'https://rubygems.org'

# install correct ruby version with rbenv, which can be installed with brew install rbenv
ruby '2.7.6'

gem "fastlane"
gem "dotenv"
gem 'cocoapods', '~> 1.12'
gem "configure_extensions"

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
