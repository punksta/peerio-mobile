import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import jest from 'jest';
import IdentityVerificationNotice from '../../app/components/shared/identityVerificationNotice';

jest.mock('react-native-fs', () => {
    const j = require('jest');
    return {
        RNFSManager: {
            RNFSFileTypeRegular: j.fn()
        }
    };
});

it('renders correctly', () => {
    const tree = renderer.create(
        <IdentityVerificationNotice />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
