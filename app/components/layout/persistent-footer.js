import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import _ from 'lodash';
import styles from '../../styles/styles';
import state from '../layout/state';

@observer
export default class PersistentFooter extends Component {
    render() {
        const style = styles.wizard.footer;
        const items = [];
        _.forOwn(state.persistentFooter, (v, k) => {
            const node = v(k);
            node && items.push(node);
        });
        return (
            <View
                pointerEvents="none"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                {items}
            </View>
        );
    }
}

