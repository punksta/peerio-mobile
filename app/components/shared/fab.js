import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import { vars, helpers } from '../../styles/styles';
import icons from '../helpers/icons';
import routerMain from '../routes/router-main';

const fabSize = vars.fabSize;

const fabContainer = {
    alignItems: 'flex-end',
    borderColor: 'red',
    borderWidth: 0
};

const fabStyle = {
    flex: 0,
    width: fabSize,
    height: fabSize,
    marginRight: fabSize / 2,
    marginBottom: fabSize * 1.5,
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

export default class Fab extends Component {
    render() {
        const s = [fabStyle, helpers.circle(fabSize), shadowStyle];
        return (
            <View
                style={fabContainer}>
                <TouchableOpacity
                    style={s}
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={() => routerMain.fabAction()}>
                    {icons.plainWhite('add')}
                </TouchableOpacity>
            </View>
        );
    }
}
