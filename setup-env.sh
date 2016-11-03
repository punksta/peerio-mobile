if [ ! -f env.sh ]; then
  echo "export PEERIO_SOCKET_SERVER=$PEERIO_SOCKET_SERVER" > env.sh
fi
