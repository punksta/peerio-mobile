import time
import random
from websocket import create_connection
from common.abstractdriver import AbstractDriver
import selenium
import appium
import os
from selenium.common.exceptions import NoSuchElementException

import common.processes

class IosDriver(AbstractDriver):
    def __init__(self, executor, capabilities, extra = None):
        AbstractDriver.__init__(self)
        self.appium = None
        self.executor = executor
        self.capabilities = capabilities
        if extra:
            self.capabilities.update(extra)

    def __exit__(self):
        self.disconnect()

    def disconnect(self):
        if self.appium:
            self.appium.quit()

    def connect(self, extra = None):
        self.disconnect()
        print self.capabilities
        self.appium = appium.webdriver.Remote(command_executor=self.executor,
                            desired_capabilities=self.capabilities)
        print "iosdriver.py: connected, waiting 3 seconds for app to launch"
        time.sleep(3)

    #----- payment system block
    def launch_settings(self):
        self.disconnect()
        settings_capabilities = self.capabilities.copy()
        settings_capabilities.update({
            "app": "com.apple.Preferences",
            "noReset": True
        })
        self.appium = appium.webdriver.Remote(command_executor=self.executor,
                            desired_capabilities=settings_capabilities)

    def enable_touchid(self):
        common.processes.enableSimulatorTouchID()

    def reset(self):
        self.appium.remove_app(self.capabilities["bundleId"])
        self.appium.install_app(self.capabilities["app"])
        self.appium.launch_app()



