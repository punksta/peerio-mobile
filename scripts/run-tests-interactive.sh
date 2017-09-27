#!/bin/bash

killall appium
killall node
sleep 1
./node_modules/.bin/appium &

echo "Waiting appium to launch on 4723..."

while ! nc -z localhost 4723; do   
  sleep 0.1
done

echo "Appium launched"

adb install -r android/app/build/outputs/apk/app-x86-debug.apk
virtualenv .pyenv && source .pyenv/bin/activate

if [ -z $"PEERIO_TEST" ]; then
  exit 0
  python -i tests/interactive.py 
else
  python -i "tests/interactive-$PEERIO_TEST.py"
fi
deactivate
