#!/bin/bash
rm -f toc.hairball
rm -f pub/homl.html
rm -f homl_notoc.html
rm -f pub/homl.epub
rm -f pub/homl.pdf
rm -f pub/css/homl.css
cp refmap.prefix refs.hairball
hairball genrefs.hairball homl.hairball | tail -n +2 >>refs.hairball
#hairball html.hairball homl.hairball | tail -n +2 >homl_notoc.html
hairball gencontents.hairball homl.hairball | tail -n +2 >toc.hairball
hairball refs.hairball html.hairball homl.hairball | tail -n +2 >homl.html
mkdir -p pub
cp homl.html pub
cp css/homl.css pub/css/homl.css
rm -f homl.zip
zip -r homl.zip pub
#pandoc -f html -t html --pdf-engine-opt=--enable-local-file-access --css pub/homl.css pub/homl.html -o pub/homl.pdf
#pandoc -f html --pdf-engine=weasyprint --css pub/homl.css homl_notoc.html -o pub/homl.pdf
#pandoc -f html -t html --css pub/homl.css pub/homl.html -o pub/homl.epub
