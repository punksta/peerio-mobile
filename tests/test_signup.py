import common.testcase
import common.helper
from time import sleep, strftime

class Signup(common.testcase.TestCase):
    def test_01_signup(self):
        username = 't' + strftime("%Y%m%d%H%M%S")
        d = common.helper.getDriver()
        d.reset()
        d.screen('signup-step-a.png')
        # push notification enable alert
        sleep(10)
        try:
            d.appium.switch_to.alert.accept()
        except:
            print 'no push allow alert'

        sleep(1)
        d.screen('signup-step-0.png')
        d.wait_for_find('button_login')
        d.tap('button_CreateAccount')
        sleep(2)
        d.screen('signup-step-1.png')
        d.send_keys('firstName', 'First')
        d.send_keys('lastName', 'Last')
        d.tap('hideKeyboard')
        d.tap('button_next')
        d.send_keys('username', username)
        d.tap('hideKeyboard')
        d.tap('button_next')
        d.send_keys('email', username + '@email.com\n')
        d.tap('hideKeyboard')
        sleep(10)
        d.screen('signup-step-2.png')
        d.tap('button_copy')
        sleep(1)
        d.tap('button_next')
        sleep(1)
        d.tap('button_accept')
        sleep(5)
        d.screen('signup-step-3.png')
        d.tap('button_share')
        sleep(2)
        d.screen('signup-step-4.png')

