#!/bin/bash
# Argument is the version number
GEB_NAME="geb-$1"
PUBDIR="geb/$GEB_NAME"
mkdir -p ./build/site
cp -r src/main/site/* ./build/site/
mkdir -p ./build/$PUBDIR
cd ./build/site
#hairball genrefs.hairball homl.hairball | tail -n +2 >>./refs.hairball
#hairball gencontents.hairball homl.hairball | tail -n +2 >./toc.hairball
hairball geb.hairball index.hairball | tail -n +2 >./index.html
cd ..
cp ./site/*.html ./$PUBDIR
cp -r ./site/css ./$PUBDIR
cp -r ./site/images ./$PUBDIR
cp -r ./site/js ./$PUBDIR
cd ./geb
GEB_ZIPNAME="$GEB_NAME.zip"
zip -r ./$GEB_ZIPNAME ./$GEB_NAME
