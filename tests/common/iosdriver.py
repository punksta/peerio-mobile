import time
import random
from settings.settings import *
from websocket import create_connection
from abstractdriver import AbstractDriver
import selenium
import appium
from selenium.common.exceptions import NoSuchElementException
import common.processes

class IosDriver(AbstractDriver):
    def __init__(self, executor, capabilities, extra = {}):
        self.appium = None
        self.executor = executor
        self.capabilities = capabilities
        self.capabilities.update(extra)

    def __exit__(self):
        self.disconnect()

    def disconnect(self):
        if self.appium:
            self.appium.quit()

    def connect(self):
        self.disconnect()
        print self.capabilities
        self.appium = appium.webdriver.Remote(command_executor=self.executor,
                            desired_capabilities=self.capabilities)
        # self.devicePixelRatio = self.appium.execute_script('return window.devicePixelRatio')
        # print "View origin: %s, device pixel ratio: %d" % (self.viewOrigin, self.devicePixelRatio)
        print "Connected"

    def text(self, selector):
        return selector.text

    def find(self, selector):
        try:
            return self.appium.find_element_by_accessibility_id(selector)
        except NoSuchElementException:
            return None

    def tap(self, selector):
        el = self.appium.find_element_by_accessibility_id(selector)
        el.click()
        return el

    def send_keys(self, selector, text):
        el = self.find(selector)
        el.clear()
        el.send_keys(text)

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


