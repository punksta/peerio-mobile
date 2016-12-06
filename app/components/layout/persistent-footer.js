import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import _ from 'lodash';
import state from '../layout/state';

const s = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
};

@observer
export default class PersistentFooter extends Component {
    render() {
        const items = [];
        _.forOwn(state.persistentFooter, (v, k) => {
            const node = v(k);
            node && items.push(node);
        });
        return (
            <View
                style={s}
                pointerEvents="none">
                {items}
            </View>
        );
    }
}

