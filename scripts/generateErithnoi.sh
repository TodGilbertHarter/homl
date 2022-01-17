#!/bin/bash
# Argument is the HOML version number
HOML_NAME="erithnoi-$1"
PUBDIR="erithnoipub/$HOML_NAME"
mkdir -p ./build/erithnoibuild
cp -r src/main/erithnoi/* ./build/erithnoibuild/
# not doing this yet... cp src/main/erithnoi/refmap.prefix ./build/erithnoibuild/refs.hairball
mkdir -p "./build/$PUBDIR"
mkdir ./build/$PUBDIR/css
cp src/main/erithnoi/css/* ./build/$PUBDIR/css
mkdir ./build/$PUBDIR/js
mkdir ./build/$PUBDIR/images
mkdir ./build/$PUBDIR/fonts
cp src/main/erithnoi/fonts/* ./build/$PUBDIR/fonts
cp src/main/erithnoi/js/* ./build/$PUBDIR/js
cp src/main/erithnoi/images/* ./build/$PUBDIR/images
cd ./build/erithnoibuild
echo "Files are copied, now in directory: " `pwd`
# hairball genrefs.hairball homl.hairball | tail -n +2 >>./refs.hairball
#hairball gencontents.hairball homl.hairball | tail -n +2 >./toc.hairball
hairball article.hairball erithnoi.hairball | tail -n +2 >./erithnoi.html
cd DungeonMaster
echo "built the index file, now going to build dungeon master stuff " `pwd`
find . -name '*.hairball' -exec sh -c "hairball ../article.hairball {} | tail -n +2 > {}.out" \;
echo "built all the DM files, going to rename them"
for i in *.out; do mv -- "$i" "${i%.hairball.out}.html"; done
echo "DM hairball files renamed correctly, going to do player files now"
cd ../Player
find . -name '*.hairball' -exec sh -c "hairball ../article.hairball {} | tail -n +2 > {}.out" \;
echo "built all the Player files, going to rename them"
for i in *.out; do mv -- "$i" "${i%.hairball.out}.html"; done
echo "Player hairball files renamed correctly, time to build everything"
cd ..
echo "we are now in directory " `pwd`
cp *.html ../$PUBDIR
mkdir -p ../$PUBDIR/DungeonMaster
cp DungeonMaster/*.html ../$PUBDIR/DungeonMaster
cp DungeonMaster/*.png ../$PUBDIR/DungeonMaster
cp DungeonMaster/*.pdf ../$PUBDIR/DungeonMaster
cp DungeonMaster/*.jpg ../$PUBDIR/DungeonMaster
mkdir -p ../$PUBDIR/Player
cp Player/*.html ../$PUBDIR/Player
cp Player/*.png ../$PUBDIR/Player
cp Player/*.pdf ../$PUBDIR/Player
cp Player/*.jpg ../$PUBDIR/Player
cd ../erithnoipub
echo "We are now in directory " `pwd`
ERITHNOI_ZIPNAME="$HOML_NAME.zip"
echo "trying to run 'zip -r ./$ERITHNOI_ZIPNAME ./$HOML_NAME"
zip -r "./$ERITHNOI_ZIPNAME" ./$HOML_NAME
