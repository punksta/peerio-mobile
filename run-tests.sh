#!/bin/bash
export PEERIO_IOS_SIM='iPhone 6'
export PEERIO_IOS_VERSION='10.2'
SIM_UDID=`xcrun instruments -s | grep "$PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)" | grep -o "\[.*\]" | tr -d '[]'`
echo $SIM_UDID
SIM_LOG="$HOME/Library/Logs/CoreSimulator/$SIM_UDID/system.log"
echo "Logs located:"
ls $SIM_LOG
virtualenv .pyenv && source .pyenv/bin/activate
npm run build-ios-sim-debug
echo > "$SIM_LOG"
py.test --platform=ios -s -x tests
deactivate
# cat $SIM_LOG
