echo "Checking env.sh"
echo `pwd`
# ls -la app/lib
# ls -la app/lib/peerio-icebear
if [ ! -f env.sh ]; then
  echo "Creating env.sh"
  echo "export PEERIO_SOCKET_SERVER=$PEERIO_SOCKET_SERVER" > env.sh
fi
mkdir -p app/lib/peerio-icebear
