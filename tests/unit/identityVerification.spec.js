import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
// const jest = require('jest');
import IdentityVerificationNotice from '../../app/components/shared/identityVerificationNotice';

beforeAll(() => {
    jest.mock('react-native-fs', () => {
        return {
            RNFSManager: {
                RNFSFileTypeRegular: jest.fn()
            }
        };
    });
});

it('renders correctly', () => {
    const tree = renderer.create(
        <IdentityVerificationNotice />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
