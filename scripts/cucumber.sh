#!/bin/bash

echo "checking test environment"

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     
        echo "Linux..."
        ;;
    Darwin*)    
        echo "Mac..."
        brew install ideviceinstaller
        brew install carthage
        brew upgrade carthage
        npm install -g ios-deploy
        ;;
esac

source env.sh

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     
        echo "Linux..."
        npm run build-android-debug
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
        ;;
esac

./node_modules/.bin/appium > ./appium.log 2> ./appium.log &
APPIUM_PID=$!

trap "exit" INT TERM
trap "kill -9 $APPIUM_PID" EXIT
sleep 1

echo "Waiting appium to launch on 4723..."

while ! nc -z localhost 4723; do   
  sleep 0.1
done

echo "Appium launched"

cucumberjs test/spec -r test/code -f node_modules/cucumber-pretty --world-parameters "{\"platform\": \"ios\"}"
cucumberjs test/spec -r test/code -f node_modules/cucumber-pretty --world-parameters "{\"platform\": \"android\"}"
