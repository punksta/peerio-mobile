#!/bin/bash

echo "checking test environment"

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     
        echo "Linux..."
        ;;
    Darwin*)    
        echo "Mac..."
        brew install ideviceinstaller
        brew install carthage
        brew upgrade carthage
        npm install -g ios-deploy
        ;;
esac

if ! [ -x "$(command -v virtualenv)" ]; then
  echo 'virtualenv is not installed.' >&2
  sudo pip install virtualenv
fi

rm -rf .pyenv
virtualenv -p `which python2.7` .pyenv && source .pyenv/bin/activate
pip install -r tests/requirements.txt
