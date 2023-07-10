#!/bin/bash
# generate the HoML rules from the hairball source.
# Note, this also constructs a corresponding compendium.json 
# Argument is the HOML version number
HOML_NAME="homl-$1"
PUBDIR="pub/$HOML_NAME"
mkdir -p ./build/rules
cp src/main/rules/* ./build/rules/
cp src/main/rules/refmap.prefix ./build/rules/refs.hairball
mkdir -p "./build/$PUBDIR"
mkdir ./build/$PUBDIR/css
cp src/main/rules/css/* ./build/$PUBDIR/css
mkdir ./build/$PUBDIR/js
mkdir ./build/$PUBDIR/images
mkdir ./build/$PUBDIR/fonts
cp src/main/rules/fonts/* ./build/$PUBDIR/fonts
cp src/main/rules/js/* ./build/$PUBDIR/js
cp src/main/rules/images/* ./build/$PUBDIR/images
cd ./build/rules
hairball genrefs.hairball homl.hairball | tail -n +2 >>./refs.hairball
echo '{' >./compendium.json
hairball refs.hairball gencompendium.hairball genboons.hairball homl.hairball | tail -n +2 >>./compendium.json
echo "," >>./compendium.json
hairball refs.hairball gencompendium.hairball genfeats.hairball homl.hairball | tail -n +2 >>./compendium.json
echo "," >>./compendium.json
hairball refs.hairball gencompendium.hairball gencallings.hairball homl.hairball | tail -n +2 >>./compendium.json
echo "," >>./compendium.json
hairball refs.hairball gencompendium.hairball genspecies.hairball homl.hairball | tail -n +2 >>./compendium.json
echo "," >>./compendium.json
hairball refs.hairball gencompendium.hairball genorigins.hairball homl.hairball | tail -n +2 >>./compendium.json
echo "," >>./compendium.json
hairball refs.hairball gencompendium.hairball genbackgrounds.hairball homl.hairball | tail -n +2 >>./compendium.json
echo '}' >>./compendium.json
#hairball gencontents.hairball homl.hairball | tail -n +2 >./toc.hairball
hairball refs.hairball gencontents.hairball homl.hairball | tail -n +2 >./toc.hairball
hairball refs.hairball html.hairball homl.hairball | tail -n +2 >./homl.html
cd ..
cp ./rules/homl.html ./$PUBDIR
cd ./pub
HOML_ZIPNAME="$HOML_NAME.zip"
zip -r "./$HOML_ZIPNAME" ./$HOML_NAME
