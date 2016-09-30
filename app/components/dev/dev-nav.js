import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import state from './../layout/state';

let currentRoute = 0;

@observer
export default class DevNav extends Component {
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.navigate = this.navigate.bind(this);
    }

    componentDidMount() {
        console.log('Mounting dev nav');
        // this.navigate();
    }

    navigate() {
        const newRoute = state.routesList.length && state.routesList[currentRoute];
        if (newRoute) {
            state.route = newRoute;
        }
    }

    next(/* value */) {
        if (++currentRoute >= state.routesList.length - 1) {
            currentRoute = 0;
        }
        this.navigate();
    }

    prev(/* value */) {
        if (--currentRoute < 0) {
            currentRoute = state.routesList.length - 1;
        }
        this.navigate();
    }

    routeLink(route, action) {
        return (
            <TouchableOpacity style={{ padding: 8 }} onPress={action}>
                <Text style={{ color: 'black' }}>{route}</Text>
            </TouchableOpacity>
        );
    }

    pageStateLink(name, i) {
        const pageAction = state.routes[state.route].states[name];
        return (
            <TouchableOpacity key={i} style={{ padding: 8 }} onPress={() => pageAction()}>
                <Text style={{ color: 'black' }}>{name}</Text>
            </TouchableOpacity>
        );
    }
    render() {
        const pages = state.pages;
        let i = 0;
        const secondaryDebug = pages.map(p => this.pageStateLink(p, i++));
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                {this.routeLink('<<', this.prev)}
                {this.routeLink('>>', this.next)}
                {this.routeLink('login', () => state.routes.loginClean.transition())}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    {secondaryDebug}
                </View>
            </View>
        );
    }
}

