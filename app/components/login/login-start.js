import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Layout1 from '../layout/layout1';
import loginState from './login-state';

@observer
export default class LoginStart extends Component {

    componentDidMount() {
        console.log('login mounted');
        loginState.clean();
    }

    componentWillUnmount() {
        console.log('login unmount');
    }

    render() {
        return <Layout1 body={null} footer={null} />;
    }
}


