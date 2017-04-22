import common.testcase
import common.helper
from time import sleep, strftime
print "signup"

def pinEnter():
    d = common.helper.getDriver()
    d.tap('pin1')
    d.tap('pin2')
    d.tap('pin5')
    d.tap('pin1')
    d.tap('pin2')
    d.tap('pin5')
    sleep(1)

class Signup(common.testcase.TestCase):
    def test_01_signup(self):
        username = 't' + strftime("%Y%m%d%H%M%S")
        d = common.helper.getDriver()
        d.reset()
        d.tap('signup')
        sleep(2)
        d.send_keys('username', username)
        d.send_keys('email', username + '@email.com')
        d.send_keys('firstName', 'First')
        d.send_keys('lastName', 'Last')
        d.tap('signupNext')
        sleep(2)
        pinEnter()
        pinEnter()
        # push notification enable alert
        d.wait_for_find('Allow')
        d.tap('Allow')
        d.wait_for_not_find('Allow')
        # confirm your email alert
        d.wait_for_find('popupButton_ok')
        d.tap('popupButton_ok')
        d.wait_for_not_find('popupButton_ok')

        # sleep(3)
        # d.tap('pin-cancel')
        # d.wait_for_find('mainLayout')
