#!/bin/bash
virtualenv .pyenv
source .pyenv/bin/activate
# prepare circleci
sim=/Applications/Xcode-8.0.app/Contents/Developer/Applications/Simulator.app
if [ -d $sim ]; then
  # prelaunch sim so there's no timeout
  echo "launching sim"
  ./node_modules/.bin/react-native run-ios --simulator="iPhone 7 (10.0)"
fi

py.test --platform=ios -s -x tests
deactivate
