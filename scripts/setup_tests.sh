echo "checking test environment"
brew install ideviceinstaller
brew install carthage
brew upgrade carthage
npm install -g ios-deploy
if ! [ -x "$(command -v virtualenv)" ]; then
  echo 'virtualenv is not installed.' >&2
  sudo pip install virtualenv
fi
virtualenv .pyenv
source .pyenv/bin/activate
pip install -r tests/requirements.txt
