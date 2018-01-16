#!/bin/bash

echo "checking test environment"

./node_modules/.bin/appium > ./appium.log 2> ./appium.log &
APPIUM_PID=$!

echo "appium PID=$APPIUM_PID"

trap "exit" INT TERM
trap "kill $APPIUM_PID" EXIT
sleep 1

echo "Waiting appium to launch on 4723..."

while ! nc -z localhost 4723; do   
  sleep 0.1
done

echo "Appium launched"

sleep 1000
