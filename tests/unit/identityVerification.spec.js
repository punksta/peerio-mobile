import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
// const jest = require('jest');
// import IdentityVerificationNotice from '../../app/components/shared/identityVerificationNotice';

beforeAll(() => {
    jest.mock('react-native-fs');
    const id = require('../../app/components/shared/identityVerificationNotice');
});

it('renders correctly', () => {
    const tree = renderer.create(
        // <IdentityVerificationNotice />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
