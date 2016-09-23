import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import _ from 'lodash';
import { observable, asMap, action, computed, autorun } from 'mobx';
import { observer } from 'mobx-react/native';

function route(name, pages) {
    return function() {
        this.route = name;
        this.pages = pages || [];
    };
}

const state = observable({
    isFirstLogin: false,
    route: '',
    prevRoute: '',
    routes: {},
    routesList: [],
    persistentFooter: [],
    pages: [],
    focusedTextBox: null,
    picker: null,
    pickerVisible: false,
    isLeftMenuVisible: false,
    isRightMenuVisible: false,
    keyboardVisible: false,
    keyboardHeight: 0,

    showPicker: action(() => {
        state.hideKeyboard();
        state.pickerVisible = true;
    }),

    hideKeyboard: action(() => {
        if (state.focusedTextBox) {
            state.focusedTextBox.blur();
            state.focusedTextBox = null;
        }
    })
});

autorun(() => {
    const r = state.routes[state.route];
    const pages = [];
    if (r && r.states) {
        _.forOwn(r.states, (val, key) => {
            pages.push(key);
        });
    }
    state.pages = pages;
    if (state.focusedTextBox) {
        state.picker = null;
        state.pickerVisible = false;
    }
});

Keyboard.addListener('keyboardWillShow', (e) => {
    state.keyboardHeight = e.endCoordinates.height;
});

Keyboard.addListener('keyboardWillHide', () => {
    state.keyboardHeight = 0;
});

export default state;
