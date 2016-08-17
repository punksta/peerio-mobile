echo "checking test environment"
if ! [ -x "$(command -v virtualenv)" ]; then
  echo 'virtualenv is not installed.' >&2
  sudo pip install virtualenv
fi
virtualenv tests/env
source tests/env/bin/activate
pip install -r tests/requirements.txt
py.test --platform=ios -s -x tests/test_sample.py
