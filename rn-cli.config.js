var blacklist = require('react-native/packager/blacklist');

var config = {
  getBlacklistRE(platform) {
    return blacklist(platform, [
        /app\/lib\/peerio-icebear\/node_modules\/.*/
    ]);
  }
};
console.log('loading custom config for packager');
module.exports = config;
