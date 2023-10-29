#!/bin/bash
mkdir ./build/documentation
hairball src/main/documentation/html.hairball src/main/documentation/md.hairball src/main/documentation/readme.hairball | tail -n +2 >build/documentation/README.md
