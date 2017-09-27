import time
import random
import jsonpickle
from settings.settings import *
from websocket import create_connection
import selenium
import random

class AbstractDriver:
    restartPlatform = None
    def __init__(self):
        return

    def send_keys(self, selector, text):
        self.find(selector).send_keys(text)
        return selector

    def clear(self, selector):
        el = self.find(selector)
        if not el:
            raise Exception('no such element: %s' % selector)
        el.clear()
        return selector

    def wait_for(self, timeout, func, msg = None):
        for i in xrange(timeout):
            try:
                return func()
            except:
                print '.'
            time.sleep(1)
        raise Exception('timeout waiting for: %s, %s' % (func, msg))

    def wait_for_find(self, xpath, timeout=30):
        return self.wait_for(timeout, lambda: self.find_except(xpath))

    def wait_for_not_find(self, xpath):
        return self.wait_for(30, lambda: self.find_not_except(xpath))

    def connect(self, extra = None):
        print "stub"

    def find_except(self, xpath):
        el = self.find(xpath)
        if not el:
            raise Exception('no such element: %s' % xpath)
        return el

    def find_not_except(self, xpath):
        el = self.find(xpath)
        if el:
            raise Exception('element still there: %s' % xpath)
        return True

    def text_by_css(self, selector, text, slow=False):
        el = self.find(selector)
        if not el:
            raise Exception('no such element: %s' % selector)
        self.clear(selector)
        if(slow):
            for c in text:
                self.send_keys(selector, c)
                time.sleep(random.randrange(1, 10) / 20.0)
        else:
            self.send_keys(selector, text)

    def wipe(self):
        if self.restartPlatform:
            self.restartPlatform({ "noReset": False })

    def dump(self):
        xml = open("page_source.debug.xml", "w")
        xml.write(self.appium.page_source.encode('utf-8'))
        xml.close()

    def accept_alert(self):
        try:
            self.appium.switch_to_alert().accept()
        except:
            print "no alert found"

    def dismiss_alert(self):
        try:
            self.appium.switch_to_alert().dismiss()
        except:
            print "no alert found"

    def accept_subscription(self):
        print "not implemented"

    def find_by_xpath(self, xpath):
        if not self.appium:
            raise Exception("Driver has no appium defined")
        try:
            return self.appium.find_element_by_xpath(xpath)
        except:
            return False

    def click_by_xpath(self, xpath):
        el = self.find_by_xpath(xpath)
        assert(el)
        el.click()

    def text_by_xpath(self, xpath, text):
        el = self.find_by_xpath(xpath)
        assert(el)
        el.click()
        el.send_keys(text)

