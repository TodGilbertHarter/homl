#!/bin/bash
# generate the GEB site from the sources
# Argument is the version number

GEB_NAME="geb-$1"
PUBDIR="geb/$GEB_NAME"
mkdir -p ./build/$PUBDIR
cd ./build/site
hairball html.hairball message.hairball | tail -n +2 >./message.html
hairball geb.hairball index.hairball | tail -n +2 >./index.html
cd ..
cp ./site/*.html ./$PUBDIR
cp -r ./site/css ./$PUBDIR
cp -r ./site/images ./$PUBDIR
cp -r ./site/js ./$PUBDIR
cd ./geb
GEB_ZIPNAME="$GEB_NAME.zip"
zip -r ./$GEB_ZIPNAME ./$GEB_NAME
