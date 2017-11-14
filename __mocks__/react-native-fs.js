const RNFS = {};// jest.genMockFromModule('react-native-fs');

RNFS.RNFSFileTypeRegular = jest.fn();
RNFS.readFile = jest.fn();
RNFS.readFileAssets = jest.fn();
RNFS.exists = jest.fn();
RNFS.existsAssets = jest.fn();
RNFS.getEncryptionStatus = jest.fn();
RNFS.readDir = () => new Promise.resolve();

module.exports = RNFS;
