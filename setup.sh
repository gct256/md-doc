#!/bin/sh

PKG=""
DPKG=""

###
### typescript
###
DPKG="$DPKG typescript"
DPKG="$DPKG @types/node"

###
### eslint
###
DPKG="$DPKG eslint @typescript-eslint/eslint-plugin eslint-config-prettier"
DPKG="$DPKG eslint-plugin-import eslint-plugin-promise"
DPKG="$DPKG @typescript-eslint/parser"

###
### eslint config
###
DPKG="$DPKG eslint-config-airbnb-base"

###
### bundler (rollup)
###
DPKG="$DPKG rollup rollup-plugin-auto-external rollup-plugin-typescript2"

if [ -n "$PKG" ]; then
  yarn add $PKG
fi

if [ -n "$DPKG" ]; then
  yarn add -D $DPKG
fi
