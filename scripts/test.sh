#!/bin/bash

# noReset: process.env.NO_RESET,
# lsof -i :8081 

rm npm-start.log || echo 'no npm log found'
rm appium.log || echo 'no appium log found'
echo "Terminating com.peerio"
xcrun simctl terminate booted com.peerio || echo 'com.peerio could not be deleted from device'

echo "Starting appium"
./node_modules/.bin/appium > ./appium.log 2> ./appium.log &
( tail -f -n0 appium.log & ) | grep -q "Appium REST http interface listener started"

echo "Starting npm"
npm start >npm-start.log & 

( tail -f -n0 npm-start.log & ) | grep -q "Loading dependency graph, done."

xcrun simctl install booted '../ios/build/Build/Products/Debug-iphonesimulator/peeriomobile.app'
xcrun simctl launch booted com.peerio
( tail -f -n0 npm-start.log & ) | grep -q "100.0%"

npm run test-ios ; \
killall npm ; \
killall node ; \
killall appium ; \
xcrun simctl install booted '../ios/build/Build/Products/Debug-iphonesimulator/peeriomobile.app'
