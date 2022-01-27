#!/bin/bash
# Generate a local version of the entire complete site, with
# the Rules, GEB, and Erithnoi parts, along with a master index page.
# Argument is the HOML version number
HOML_NAME="homl-$1"
PUBDIR="local"
mkdir -p ./build/local
cp -r ./build/pub/homl-$1/* ./build/local
cp -r ./build/geb/geb-$1/* ./build/local
cp -r ./build/erithnoipub/erithnoi-$1/* ./build/local