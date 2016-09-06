import React, { Component } from 'react';
import _ from 'lodash';
import { observable, asMap, action, computed, autorun } from 'mobx';
import state from '../layout/state';

const loginState = observable({
    username: '',
    name: 'Peerio Test',
    passphrase: '',
    language: 'English',
    savedUserInfo: true,
    @action login() {
        state.routes.main.transition();
    }
});

export default loginState;
