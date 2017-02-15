import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import { vars, helpers } from '../../styles/styles';
import icons from '../helpers/icons';
import ghostState from './ghost-state';

const fabSize = vars.fabSize;

const fabContainer = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
    borderColor: 'red',
    borderWidth: 0
};

const fabStyle = {
    flex: 0,
    width: fabSize,
    height: fabSize,
    marginRight: fabSize / 2,
    marginBottom: fabSize,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7D00'
};

const shadowStyle = {
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
        height: 6,
        width: 1
    }
};

export default class GhostSendButton extends Component {
    render() {
        const s = [fabStyle, helpers.circle(fabSize), shadowStyle];
        return (
            <View
                style={fabContainer}>
                <TouchableOpacity
                    style={s}
                    pressRetentionOffset={vars.offset}
                    onPress={() => ghostState.send()}>
                    {icons.plainWhite('send')}
                </TouchableOpacity>
            </View>
        );
    }
}

