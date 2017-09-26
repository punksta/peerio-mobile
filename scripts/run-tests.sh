#!/bin/bash
# export PEERIO_IOS_SIM='iPhone 6'
# export PEERIO_IOS_VERSION='10.2'
# SIM_UDID=`xcrun instruments -s | grep "$PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)" | grep -o "\[.*\]" | tr -d '[]'`
# echo $SIM_UDID
# SIM_LOG="$HOME/Library/Logs/CoreSimulator/$SIM_UDID/system.log"
# echo "Logs located:"
# ls $SIM_LOG
killall appium
./node_modules/.bin/appium &
adb install android/app/build/outputs/apk/app-x86-debug.apk
virtualenv .pyenv && source .pyenv/bin/activate
# npm run build-ios-sim-debug
py.test --platform=android -s -x tests
deactivate

if [ -z $"$CIRCLE_TEST_REPORTS" ]; then
  exit 0
else
  mkdir -p $CIRCLE_TEST_REPORTS/py.test/
  cp $SIM_LOG $CIRCLE_TEST_REPORTS/py.test/
fi
