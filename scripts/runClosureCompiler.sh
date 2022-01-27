#!/bin/bash
# Run the closure compiler on the GEB site javascript modules. 
# Currently this doesn't quite work, although it will RUN, I need to work out exactly
# how to Closure Compile against the dependencies. Presumably it will also be necessary to 
# run some kind of packer? I'm not sure...
GEB_NAME="geb-$1"
java -jar ./build/cc/closure-compiler-v20211201.jar --language_in ES_NEXT -O SIMPLE --js build/site/js/*.js --js_output_file build/geb/${GEB_NAME}/js/library.js