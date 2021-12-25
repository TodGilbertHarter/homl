#!/bin/bash
# Argument is the version number
GEB_NAME="geb-$1"
PUBDIR="geb/$GEB_NAME"
mkdir -p ./build/site
cp -r src/main/site/* ./build/site/
