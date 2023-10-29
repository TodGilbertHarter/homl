#!/bin/bash
# Push the Erithnoi files out to the web site.
# Argument is the HOML version number
HOML_NAME="erithnoi-$1"
PUBDIR="erithnoipub/$HOML_NAME"
cd ./build/$PUBDIR
gsutil cp css/* gs://homl2/css
gsutil cp *.html gs://homl2
gsutil cp  images/* gs://homl2/images
gsutil cp fonts/* gs://homs2/fonts
