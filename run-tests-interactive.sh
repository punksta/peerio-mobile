#!/bin/bash
export PEERIO_IOS_SIM='iPhone 6'
export PEERIO_IOS_VERSION='10.2'

virtualenv .pyenv
source .pyenv/bin/activate
# ./node_modules/.bin/react-native run-ios --simulator="$PEERIO_IOS_SIM"
python -i tests/interactive.py 
deactivate
