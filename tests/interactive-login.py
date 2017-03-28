from interactive import d
from time import sleep

print "login"

d.reset()
d.tap('login')
sleep(1)
d.send_keys('username', 't1490700725079')
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
sleep(3)
d.tap('pin-cancel')
d.wait_for_find('mainLayout')