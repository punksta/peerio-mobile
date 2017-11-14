import React from 'react';
import { Text, NativeModules } from 'react-native';
import renderer from 'react-test-renderer';
import jest from 'jest';
import IdentityVerificationNotice from '../../app/components/shared/identityVerificationNotice';

// jest.mock('NativeModules', () => {
//     const React = require('react');
//     return {
//         RNFSManager: {
//             RNFSFileTypeRegular: jest.fn()
//         }
//     };
// });


beforeEach(() => {
    NativeModules.RNFSManager = { RNFSFileTypeRegular: jest.fn(()=>{}) };
    // require('react-native-fs').__setMockFiles();
});

it('renders correctly', () => {
    const tree = renderer.create(
        // <Text>test</Text>
        <IdentityVerificationNotice />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
