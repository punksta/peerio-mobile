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
        d.screen('signup-step-0.png')
        d.tap('signup')
        sleep(2)
        d.screen('signup-step-1.png')
        d.send_keys('username', username)
        d.send_keys('email', username + '@email.com')
        d.send_keys('firstName', 'First')
        d.send_keys('lastName', 'Last')
        d.tap('signupStep1Title')
        sleep(1)
        d.tap('signupNext')
        d.screen('signup-step-2.png')
        sleep(2)
        d.tap('signupNext')
        # pinEnter()
        # pinEnter()
        # push notification enable alert
        d.wait_for_find('Allow')
        d.tap('Allow')
        d.wait_for_not_find('Allow')
        # confirm your email alert
        d.wait_for_find('popupButton_ok')
        d.tap('popupButton_ok')
        d.wait_for_not_find('popupButton_ok')

        sleep(3)
        d.screen('signup-step-3.png')
        # d.tap('pin-cancel')
        # d.wait_for_find('mainLayout')
