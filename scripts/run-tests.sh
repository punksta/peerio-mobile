#!/bin/bash

# trap "exit" INT TERM
# trap "kill 0" EXIT
sleep 1

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
        SIM_UDID=`xcrun instruments -s | grep "$PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)" | grep -o "\[.*\]" | tr -d '[]'`
        echo $SIM_UDID
        SIM_LOG="$HOME/Library/Logs/CoreSimulator/$SIM_UDID/system.log"
        echo "Logs located:"
        ls $SIM_LOG
        echo "$PEERIO_IOS_SIM ($PEERIO_IOS_VERSION) $SIM_UDID"
        # ./node_modules/.bin/react-native run-ios --simulator=$SIM_UDID
        ;;
esac

./node_modules/.bin/appium &

echo "Waiting appium to launch on 4723..."

while ! nc -z localhost 4723; do   
  sleep 0.1
done

echo "Appium launched"

virtualenv .pyenv && source .pyenv/bin/activate
py.test --platform=$PEERIO_TEST_PLATFORM -s -x tests
deactivate

# if [ -z $"$CIRCLE_TEST_REPORTS" ]; then
#   exit 0
# else
#   mkdir -p $CIRCLE_TEST_REPORTS/py.test/
#   cp $SIM_LOG $CIRCLE_TEST_REPORTS/py.test/
# fi
