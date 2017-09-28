#!/bin/bash 

adb uninstall com.peerio.app
adb install android/app/build/outputs/apk/app-x86-debug.apk
