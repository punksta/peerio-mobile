if [ ! -f env.sh ]; then
  echo "export PEERIO_SOCKET_SERVER=$PEERIO_SOCKET_SERVER" > env.sh
fi
if [ ! -d app/lib/peerio-icebear ]; then
  ln -s ../../../peerio-icebear/src app/lib/peerio-icebear
fi
