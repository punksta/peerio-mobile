#!/bin/bash

mkdir -p android/app/src/main/res/raw
cp -r app/sounds/*.mp3 android/app/src/main/res/raw
cp -r locales android/app/src/main/assets/
cp -r node_modules/peerio-copy/phrase/dict android/app/src/main/assets/
cp app/assets/terms.txt android/app/src/main/assets/

