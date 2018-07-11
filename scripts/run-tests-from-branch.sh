#!/bin/bash

git checkout $1
git pull

rm npm-start.log || echo 'no NPM log found'
rm appium.log || echo 'no Appium log found'

echo "Terminating com.peerio"
xcrun simctl terminate booted com.peerio || echo 'com.peerio could not be found on device'

echo "Starting Appium"
./node_modules/.bin/appium > ./appium.log 2> ./appium.log &
( tail -f -n0 appium.log & ) | grep -q "Appium REST http interface listener started"

echo "Starting NPM"
npm start >npm-start.log & 
( tail -f -n0 npm-start.log & ) | grep -q "Loading dependency graph, done."

echo "Loading app from packager"
source ./reinstall-ios.sh
xcrun simctl launch booted com.peerio
( tail -f -n0 npm-start.log & ) | grep -q "100.0%"

npm run test-ios ; \
killall npm ; \
killall node ; \
killall appium ; \
source ./reinstall-ios.sh
