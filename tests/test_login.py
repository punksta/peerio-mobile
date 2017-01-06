from time import sleep
import common.testcase
import common.helper

class Login(common.testcase.TestCase):
    def test_01_login(self):
        d = common.helper.getDriver()
        d.reset()
        d.send_keys('username', 'anritest8')
        d.tap('logo')
        d.send_keys('passphrase', 'icebear')
        d.tap('logo')
        d.tap('loginButton')
        d.wait_for_find('mainLayout')
