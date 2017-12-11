#!/bin/bash

source env.sh

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)
        echo "Linux..."
        npm run build-android-debug
        # adb install -r android/app/build/outputs/apk/app-x86-debug.apk
        ;;
    Darwin*)
        echo "Mac..."
        killall -9 Simulator
        SIM_UDID=`xcrun instruments -s | grep -E "$PEERIO_IOS_SIM \($PEERIO_IOS_VERSION.*\)" | grep -o "\[.*\]" | tr -d '[]'`
        if [ -z $"$SIM_UDID" ]; then
          echo "Could not find simulator: $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)"
          echo "Available simulators:"
          xcrun instruments -s
          exit 1
        fi
        SIM_LOG="$HOME/Library/Logs/CoreSimulator/$SIM_UDID/system.log"
        echo "Logs located:"
        ls $SIM_LOG
        echo "$PEERIO_IOS_SIM ($PEERIO_IOS_VERSION) $SIM_UDID"
        # ./node_modules/.bin/react-native run-ios --simulator=$SIM_UDID
        ;;
esac

./node_modules/.bin/appium > /dev/null &
APPIUM_PID=$!

trap "exit" INT TERM
trap "kill $APPIUM_PID" EXIT
sleep 1

echo "Waiting appium to launch on 4723..."

while ! nc -z localhost 4723; do
  sleep 0.1
done

echo "Appium launched"

virtualenv .pyenv && source .pyenv/bin/activate
py.test --platform=$PEERIO_TEST_PLATFORM -s -x tests
deactivate

if [ -z $"$CIRCLE_ARTIFACTS" ]; then
  exit 0
else
  mkdir -p $CIRCLE_ARTIFACTS/py.test/
  cp $SIM_LOG $CIRCLE_ARTIFACTS/py.test/
fi
