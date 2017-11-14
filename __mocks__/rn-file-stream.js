const RNFileStream = {};

RNFileStream.open = jest.fn();
RNFileStream.close = jest.fn();
RNFileStream.readInternal = jest.fn();
RNFileStream.seekInternal = jest.fn();
RNFileStream.writeInternal = jest.fn();

module.exports = RNFileStream;