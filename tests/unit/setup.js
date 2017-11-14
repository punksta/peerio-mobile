jest.mock('react-native', () => ({
    NativeModules: {
        RNFSManager: {
            getEncryptionStatus: () => new Promise.resolve()
        }
    },
    Dimensions: {
        get: () => ({
            width: jest.fn(),
            height: jest.fn()
        })
    },
    Platform: {
        get: () => jest.fn()
    }
}));