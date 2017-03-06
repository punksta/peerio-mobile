#!/usr/bin/python

import subprocess
import os
import sys

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print "Usage: get-pins.py host:port"
        sys.exit()
    host = sys.argv[1]
    FNULL = open(os.devnull, 'w')
    cmd = ["openssl",
           "s_client",
           "-showcerts",
           "-connect",
           host,
           "-prexit"]
    r = subprocess.Popen(cmd,
                         stdin=FNULL,
                         stderr=subprocess.STDOUT,
                         stdout=subprocess.PIPE
                         )
    cert = False
    while True:
        line = r.stdout.readline()
        if line != '':
            if line.startswith("-----BEGIN CERTIFICATE-----"):
                cert = True
            if cert:
                sys.stdout.write(line)
            if line.startswith("-----END CERTIFICATE-----"):
                cert = False
                break
        else:
            break

