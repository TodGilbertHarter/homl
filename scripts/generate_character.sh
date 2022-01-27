#!/bin/bash
# Generate the HoML character sheet and embedded character sheet
GEB_NAME="geb-$1"
PUBDIR="geb/$GEB_NAME"
mkdir -p ./build/$PUBDIR
cd ./build/site
hairball charsheet.hairball "$2_charactersheet.hairball" | tail -n +2 >"$2_charactersheet.html"
hairball embedded_charsheet.hairball "empty_charactersheet.hairball" | tail -n +2 >"embedded_charactersheet.html"
