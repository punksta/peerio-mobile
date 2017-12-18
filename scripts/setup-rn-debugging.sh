#!/bin/bash

echo "Patching RN to disable automatic package launching"
perl -pi -e 's/RCT_NO_LAUNCH_PACKAGER/MAC_OS_X_PRODUCT_BUILD_VERSION/g' node_modules/react-native/React/React.xcodeproj/project.pbxproj
echo "Patching RN to enable device debugging"

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     
        machine=Linux
        ip=$(ip addr | grep 'state UP' -A2 | tail -n1 | awk '{print $2}' | cut -f1  -d'/')
        ;;
    Darwin*)    
        machine=Mac
        ip="$(ifconfig $(route -n get default | awk '/interface: / {print $NF}') | awk '/inet / {print $2}')"
        ;;
#    CYGWIN*)    
#        machine=Cygwin
#        ;;
#    MINGW*)    
#        machine=MinGw
#        ;;
#    *)          
#        machine="UNKNOWN:${unameOut}"
#        ;;
esac
echo "Machine is ${machine}"
echo "Local ip: $ip"

sed -i.bak "s/host = @.*/host = @\"$ip\";/" node_modules/react-native/Libraries/WebSocket/RCTWebSocketExecutor.m
sed -i.bak "s/host = ipGuess \?: @.*/host = ipGuess ?: @\"$ip\";/" node_modules/react-native/React/Base/RCTBundleURLProvider.m
