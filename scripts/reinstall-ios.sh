#!/bin/bash

APP_NAME=ios/build/Build/Products/Debug-iphonesimulator/peeriomobile.app
BUNDLE_NAME=com.peerio
xcrun simctl uninstall booted $BUNDLE_NAME
xcrun simctl install booted $APP_NAME
xcrun simctl launch booted $BUNDLE_NAME

