import time
import random
from settings.settings import *
from websocket import create_connection
from abstractdriver import AbstractDriver
import selenium
import appium
from selenium.common.exceptions import NoSuchElementException

class AndroidDriver(AbstractDriver):
    def __init__(self, executor, capabilities, chromium_executor, chromium_capabilities, extra):
        self.executor = executor
        self.capabilities = capabilities
        self.capabilities.update(extra)
        # self.chromium_executor = chromium_executor
        # self.chromium_capabilities = chromium_capabilities
        self.appium = None
        # self.chromium = None

    def __exit__(self):
        self.disconnect()

    def disconnect(self):
        if self.appium:
            self.appium.quit()
        # if self.chromium:
        #    self.chromium.quit()

    def reset(self):
        print "reset stub"

    def connect(self):
        self.disconnect()
        self.appium = appium.webdriver.Remote(command_executor=self.executor,
                            desired_capabilities=self.capabilities)

    def execute_script(self, script):
        print "execute script stub"

    def open_settings(self):
        self.disconnect()
        # appium can automate only one app
        deviceName = self.capabilities['deviceName']

        sc = {
            'appPackage': 'com.android.settings',
            'appActivity': '.Settings',
            'platformName': 'Android',
            'device': 'Android',
            'deviceName': deviceName,
            'udid': deviceName,
            'newCommandTimeout': 12000,
            'autoLaunch': True
        }

        self.appium = appium.webdriver.Remote(command_executor=self.executor,
                            desired_capabilities=sc)


