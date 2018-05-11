import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import SignupStepMedical from '../signup/signup-step-medical';
import { User } from '../../lib/icebear';

@observer
export default class MockSignupStepMedical extends Component {
    componentWillMount() {
        // for Contact constructor to work
        User.current = {
            username: 'testtest'
        };
    }

    render() {
        return (
            <SignupStepMedical />
        );
    }
}
