#!/bin/bash
export PEERIO_IOS_SIM='iPhone 6'
export PEERIO_IOS_VERSION='10.2'

virtualenv .pyenv
source .pyenv/bin/activate
npm run build-ios-sim-debug
python -i tests/interactive.py 
deactivate
