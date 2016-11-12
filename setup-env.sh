echo "Checking env.sh"
if [ ! -f env.sh ]; then
  echo "Creating env.sh"
  echo "export PEERIO_SOCKET_SERVER=$PEERIO_SOCKET_SERVER" > env.sh
  source env.sh
fi
echo "Checking icebear lib existence"
if [ ! -d app/lib/peerio-icebear ]; then
  echo "Copying icebear lib"
  cp -r node_modules/peerio-icebear app/lib/peerio-icebear
fi
