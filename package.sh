#!/usr/bin/env bash

tsc
rm -rf docs/*
cp *.html docs/
cp *.css docs/
cp pouriya_zarbafian.pdf docs/
cp -r img docs/
#cp js-gen/*.js docs/
cp js-gen/* docs/