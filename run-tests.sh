#!/bin/bash
virtualenv .pyenv
source .pyenv/bin/activate
py.test --platform=ios -s -x tests
deactivate
