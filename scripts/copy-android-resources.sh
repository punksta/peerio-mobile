#!/bin/bash

mkdir -p android/app/src/main/res/raw
cp -r app/sounds/*.mp3 android/app/src/main/res/raw
cp -r locales android/app/src/main/assets/
cp -r node_modules/peerio-copy/phrase/dict android/app/src/main/assets/
cp app/assets/terms.txt android/app/src/main/assets/
cp app/assets/push.png android/app/src/main/res//drawable-xxhdpi/push.png
cp app/assets/push.png android/app/src/main/res//drawable-xhdpi/push.png
cp app/assets/push.png android/app/src/main/res//drawable-hdpi/push.png
cp app/assets/push.png android/app/src/main/res//drawable-mdpi/push.png

