import React, { Component } from 'react';
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
    route: '',
    prevRoute: '',
    routes: {},
    routesList: [],
    persistentFooter: [],
    pages: [],
    isLeftMenuVisible: false,
    isRightMenuVisible: false
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
});

export default state;
