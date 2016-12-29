#!/bin/bash
virtualenv .pyenv
source .pyenv/bin/activate
# prepare circleci
sim=/Applications/Xcode-8.0.app/Contents/Developer/Applications/Simulator.app
device=33D34EBA-703E-4A82-8838-BE75171492E1
if [ -e $sim ]; then
  # prelaunch sim so there's no timeout
  open -Fn $sim --args -CurrentDeviceUDID $device
fi

py.test --platform=ios -s -x tests
deactivate
