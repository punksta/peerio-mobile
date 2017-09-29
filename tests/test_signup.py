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
        try:
            d.wait_for_find('Allow', 5)
            d.tap('Allow')
            d.wait_for_not_find('Allow')
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
        d.send_keys('username', username)
        d.send_keys('email', username + '@email.com\n')
        sleep(5)
        # d.tap('signupStep1Title')
        # sleep(5)
        d.tap('button_next')
        d.screen('signup-step-2.png')
        sleep(5)
        d.tap('button_next')
        sleep(3)
        d.send_keys('confirmText', 'i have saved my account key')
        sleep(10)
        d.tap('button_finish')
        sleep(5)
        d.screen('signup-step-3.png')

