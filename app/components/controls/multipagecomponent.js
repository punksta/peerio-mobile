import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';

const pages = observable({pages: []});
let pageState = null;

pages.change = function(name) {
    for (var prop in pages.pages) {
        if (pages.pages.hasOwnProperty(prop)) {
            pageState[prop] = prop === name;
        }
    }
};

@observer
export default class MultiPageComponent extends Component {
    componentWillMount() {
        pageState = this.pageState();
        pages.pages = this.getPages();
    }
    componentWillUnmount() {
        pages.pages = [];
    }
    page(name) {
        const state = this.pageState();
        return state[name] ? pages.pages[name] : null;
    }
}

export { pages };
