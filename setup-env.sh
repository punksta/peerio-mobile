if [ ! -f env.sh ]; then
  echo "export PEERIO_SOCKET_SERVER=$PEERIO_SOCKET_SERVER" > env.sh
  source env.sh
fi
if [ ! -d app/lib/peerio-icebear ]; then
  cp -r node_modules/peerio-icebear app/lib/peerio-icebear
fi
