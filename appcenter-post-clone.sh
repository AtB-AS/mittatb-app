#!/usr/bin/env bash
#
# Report build status next to github commit.
#
# Adjust settings in github.sh file
#
#
# Originally written by: Mirosław Zawisza
# https://zeyomir.github.io
# 
# The MIT License (MIT)
# Copyright (c) Microsoft Corporation

source github.sh

github_set_status_pending

#!/usr/bin/env bash
CUR_COCOAPODS_VER=`sed -n -e 's/^COCOAPODS: \([0-9.]*\)/\1/p' ios/Podfile.lock`
ENV_COCOAPODS_VER=`pod --version`

# check if not the same version, reinstall cocoapods version to current project's
if [ $CUR_COCOAPODS_VER != $ENV_COCOAPODS_VER ];
then
    echo "Uninstalling all CocoaPods versions"
    sudo gem uninstall cocoapods --all --executables
    echo "Installing CocoaPods version $CUR_COCOAPODS_VER"
    sudo gem install cocoapods -v $CUR_COCOAPODS_VER
else 
    echo "CocoaPods version is suitable for the project"
fi;

# copy file mapbox api download token
cat .netrc >> ~/.netrc