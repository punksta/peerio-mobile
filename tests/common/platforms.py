import appium
import selenium
import time
import random
from settings import settings
import sys
import common.processes
from websocket import create_connection
from common.browserdriver import BrowserDriver
from common.androiddriver import AndroidDriver
from common.iosdriver import IosDriver
from common.iosdriverfast import IosDriverFast

def launchPlatform(platform):
    method = getattr(sys.modules[__name__], 'platform_' + platform)
    if not method:
        return False
    platform_options = method()
    set_platform(platform_options)
    if 'appium' in platform_options and platform_options['appium']:
        common.processes.restartAppium()
    return True

__platform = None

def get_platform():
    if not __platform:
        set_platform(platform_ios())
    return __platform

def set_platform(platform):
    global __platform
    __platform = platform

def platform_ios():
    return {
        'appium': True,
        'type': 'ios',
        'device': False,
        'driver': lambda extra: IosDriverFast(
            settings.executor, settings.ios_10(settings.ios_basic()), extra)
    }

def platform_iosdevice():
    udid = settings.getIPhoneDeviceID()
    if not udid:
        raise Exception("No iOS devices connected")
    return {
        'type': 'ios',
        'device': True,
        'appium': True,
        'ios_webkit_debug_proxy': True,
        'driver': lambda extra: IosDriverFast(
            settings.executor, settings.ios_device(udid), extra)
    }

def platform_androiddevice():
    device = settings.getFirstPhysicalAndroidDeviceID()
    return {
        'appium': True,
        'type': 'android',
        'device': True,
        'chromedriver': True,
        'driver': lambda extra: AndroidDriver(
            settings.executor,
            settings.android_device(device["name"]),
            settings.chromium_executor,
            settings.chromium_basic(), extra)
    }

def platform_android():
    device = settings.getFirstGenyMotionAndroidDeviceID()
    return {
        'platformName': 'GenyMotion',
        'type': 'android',
        'device': True, # genymotion simulators
        'appium': True,
        'chromedriver': True,
        'driver': lambda extra: AndroidDriver(
            settings.executor,
            settings.android_600(settings.android_basic(device["name"])),
            settings.chromium_executor,
            settings.chromium_basic(), extra)
    }

