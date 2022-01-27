#!/bin/bash
# builds Hairball source of Erithnoi docs by reprocessing the exported xwiki sources
# this should be obsolete, but I'll keep it around in case there's ever a need to 
# revisit this process.
# arguments are output, and input
mkdir -p $1
ORIG=`pwd`
cd $2
for i in *.xml; do mv -- "$i" "${i%.xml}.hairball"; done
find . -name '*.base64' -exec sh -c "base64 -d {} > {}.foob" \;
for i in *.foob; do mv -- "$i" ${i%.base64.foob}; done
cd "${ORIG}"
mv $2/*.hairball $1
mv $2/*.png $1
mv $2/*.pdf $1
mv $2/*.jpg $1
#mv $2/*.gif $1
