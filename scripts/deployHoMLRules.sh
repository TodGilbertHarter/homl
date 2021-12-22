#!/bin/bash
cd ./build/pub
gsutil cp css/* gs://homl2/css
gsutil cp homl.html gs://homl2
