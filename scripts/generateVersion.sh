#!/bin/bash
# Token substitute into file to create a version number constant.
sed -e "s/@version@/'$1'/g" <$2 >$3