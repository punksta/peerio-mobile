from interactive import d

print "login"

d.reset()
d.send_keys('username', 'anritest8')
d.tap('logo')
d.send_keys('passphrase', 'icebear')
d.tap('logo')
d.tap('loginButton')
# waiting for push notification popup
# may have locale issues
d.wait_for_find('Allow')
d.tap('Allow')
d.wait_for_not_find('Allow')
d.wait_for_find('mainLayout')
