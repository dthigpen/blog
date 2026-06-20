#!/usr/bin/env bash

src="${1?}"
dst="${2?}"
magick "$src" \
    -resize '1200x>' \
    -quality 85 \
    "$dst"