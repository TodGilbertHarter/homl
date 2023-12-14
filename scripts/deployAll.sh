#!/bin/bash
# Deploy the 
HOML_NAME="homl-$1"
PUBDIR="local"
cd ./build/$PUBDIR
gsutil cp css/* gs://homl2/css
gsutil cp *.html gs://homl2
gsutil cp  images/* gs://homl2/images
gsutil cp fonts/* gs://homl2/fonts
gsutil cp -r js/* gs://homl2/js
gsutil cp -r DungeonMaster gs://homl2
gsutil cp -r Player gs://homl2
