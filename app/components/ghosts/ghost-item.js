import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import mainState from '../main/main-state';

@observer
export default class GhostItem extends Component {
    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Text>ghost item</Text>
            </View>
        );
    }
}

GhostItem.propTypes = {
    ghost: React.PropTypes.any.isRequired
};
