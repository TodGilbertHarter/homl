#!/bin/bash
rm -f "$1_charactersheet.html"
hairball charsheet.hairball "$1_charactersheet.hairball" | tail -n +2 >"$1_charactersheet.html"
