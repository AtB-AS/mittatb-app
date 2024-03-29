#!/bin/bash

echo "Adding Entur private registry credentials"

NPMRC_FILE="$HOME/.npmrc"
echo "Adding Entur registry properties to $NPMRC_FILE"

echo "@entur-private:registry=https://entur2.jfrog.io/entur2/api/npm/partner-npm-local/" >> $NPMRC_FILE
echo "//entur2.jfrog.io/entur2/api/npm/partner-npm-local/:_authToken=$ENTUR_REGISTRY_TOKEN" >> $NPMRC_FILE

GRADLE_DIRECTORY="$HOME/.gradle"
mkdir -p $GRADLE_DIRECTORY
GRADLE_PROPERTIES="$GRADLE_DIRECTORY/gradle.properties"
echo "Adding Entur registry properties to $GRADLE_PROPERTIES"

echo "entur_artifactory_partner_resolve_snapshot_url=https://entur2.jfrog.io/entur2/partner-snapshot" >> $GRADLE_PROPERTIES
echo "entur_artifactory_partner_resolve_release_url=https://entur2.jfrog.io/entur2/partner-release" >> $GRADLE_PROPERTIES
echo "entur_artifactory_user=$ENTUR_REGISTRY_USER" >> $GRADLE_PROPERTIES
echo "entur_artifactory_password=$ENTUR_REGISTRY_TOKEN" >> $GRADLE_PROPERTIES