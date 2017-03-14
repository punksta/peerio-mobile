from time import sleep
import common.testcase
import common.helper

class Login(common.testcase.TestCase):
    def test_01_login(self):
        d = common.helper.getDriver()
        d.reset()
        d.tap('login')
        sleep(1)
        d.send_keys('username', 'anritest9')
        d.tap('logo')
        sleep(1)
        d.tap('continue')
        sleep(1)
        d.send_keys('passphrase', 'icebear')
        d.tap('logo')
        sleep(1)
        d.tap('login')
        sleep(1)
        d.wait_for_find('Allow')
        d.tap('Allow')
        d.wait_for_not_find('Allow')
        d.wait_for_find('mainLayout')
