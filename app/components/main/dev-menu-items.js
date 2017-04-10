import { socket } from '../../lib/icebear';

function toggleConnection() {
    socket.connected ? socket.close() : socket.open();
}

module.exports = { toggleConnection };
