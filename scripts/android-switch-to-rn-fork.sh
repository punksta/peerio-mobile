#!/bin/bash

find node_modules -name "build.gradle" -maxdepth 3 | xargs sed -i.bak -e "s/^.*compile .*com.facebook.react:react-native:.*$/    compile project(':ReactAndroid')/"
