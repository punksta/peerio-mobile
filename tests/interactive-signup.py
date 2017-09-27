from interactive import d
from time import sleep, strftime
print "signup"

# username = 't' + strftime("%Y%m%d%H%M%S")

# d.reset()
# d.tap('signup')
# sleep(1)
# d.send_keys('username', username)
# d.send_keys('email', username + '@email.com')
# d.send_keys('firstName', 'First')
# d.send_keys('lastName', 'Last')
# d.tap('signupNext')
# pinEnter()
# pinEnter()

# # push notification enable alert
# d.wait_for_find('Allow')
# d.tap('Allow')
# d.wait_for_not_find('Allow')

# # confirm your email alert
# d.wait_for_find('popupButton_ok')
# d.tap('popupButton_ok')
# d.wait_for_not_find('popupButton_ok')

d.tap("rightMenuButton")
sleep(1)
d.tap("settings")
sleep(1)
d.tap("security")
sleep(1)
d.tap("passphrase")
sleep(1)
pinEnter()

# sleep(3)
# d.tap('pin-cancel')
# d.wait_for_find('mainLayout')
