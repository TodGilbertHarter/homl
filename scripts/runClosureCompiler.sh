#!/bin/bash

GEB_NAME="geb-$1"
java -jar ./build/cc/closure-compiler-v20211201.jar --language_in ES_NEXT -O SIMPLE --js build/site/js/*.js --js_output_file build/geb/${GEB_NAME}/js/library.js