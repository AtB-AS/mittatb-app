#!/bin/bash

# Read a property safely from config file, instead of sourcing the file
function envprop() {
  grep -e "^${1}=" ./.env | cut -d'=' -f2 | head -n 1;
}