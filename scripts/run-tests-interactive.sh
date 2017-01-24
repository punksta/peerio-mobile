#!/bin/bash
export PEERIO_IOS_SIM='iPhone 6'
export PEERIO_IOS_VERSION='10.2'

virtualenv .pyenv
source .pyenv/bin/activate
npm run build-ios-sim-debug
if [ -z $"PEERIO_TEST" ]; then
  exit 0
  python -i tests/interactive.py 
else
  python -i "tests/interactive-$PEERIO_TEST.py"
fi
deactivate
