#!/bin/bash
# Run an XSLT transform with Saxon-HE
# arguments are source, stylesheet, and output
mkdir -p $3
java -jar build/saxon/Saxon-HE-10.6.jar -s:$1 -xsl:$2 -o:$3
