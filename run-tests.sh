#!/bin/bash
export PEERIO_IOS_SIM='iPhone 6'
export PEERIO_IOS_VERSION='10.2'

virtualenv .pyenv
source .pyenv/bin/activate
kill $(ps aux | grep '[S]imulator.app' | awk '{print $2}')
./node_modules/.bin/react-native run-ios --simulator="$PEERIO_IOS_SIM"
py.test --platform=ios -s -x tests
deactivate
