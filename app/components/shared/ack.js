import React, { Component } from 'react';
import {
    View
} from 'react-native';
import icons from '../helpers/icons';

export default class Ack extends Component {
    render() {
        return (
            <View>
                {icons.plaindark('thumb-up')}
            </View>
        );
    }
}

Ack.propTypes = {
};

