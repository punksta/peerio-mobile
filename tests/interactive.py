import unittest
import os
from time import sleep
import common.helper as h
import common.platforms
from BaseHTTPServer import BaseHTTPRequestHandler
import SocketServer
import thread


common.platforms.launchPlatform("ios")
h.connect()

d = h.getDriver()

class AppiumSourceHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/xml')
        self.end_headers()
        self.wfile.write(d.appium.page_source.encode('utf-8'))

PORT = 8001
def start_server():
    handler = AppiumSourceHandler
    server = SocketServer.TCPServer(("", PORT), handler)
    server.serve_forever()

print "interactive.py: starting http server http://localhost:%d" % PORT
thread.start_new_thread(start_server, ())
sleep(1)
# os.system("open http://localhost:%d" % PORT)

# starter({})
# t = AppleAdvertisement()
# t = LocaleTest()
# t.test_01_locale_start()
