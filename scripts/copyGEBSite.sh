#!/bin/bash
# copy files from the GEB site source directory to a build directory
# for further processing.
# Argument is the version number
GEB_NAME="geb-$1"
PUBDIR="geb/$GEB_NAME"
mkdir -p ./build/site
cp -r src/main/site/* ./build/site/
