#!/bin/bash
echo "Patching RN to disable automatic package launching"
perl -pi -e 's/RCT_NO_LAUNCH_PACKAGER/MAC_OS_X_PRODUCT_BUILD_VERSION/g' node_modules/react-native/React/React.xcodeproj/project.pbxproj
echo "Patching RN to enable device debugging"
ip="$(ifconfig $(route -n get default | awk '/interface: / {print $NF}') | awk '/inet / {print $2}')"
echo "Local ip: $ip"
sed -i.bak "s/host = @.*/host = @\"$ip\";/" node_modules/react-native/Libraries/WebSocket/RCTWebSocketExecutor.m
