import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import { vars, helpers } from '../../styles/styles';
import icons from '../helpers/icons';
import imagePicker from '../helpers/imagepicker';

const fabSize = vars.fabSize;

const fabContainer = {
    position: 'absolute',
    right: vars.fabRight,
    bottom: vars.fabBottom,
    borderColor: 'red',
    borderWidth: 0
};

const fabStyle = {
    flex: 0,
    width: fabSize,
    height: fabSize,
    marginRight: fabSize * 0.25,
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
    fabAction() {
        imagePicker.test();
    }

    render() {
        const s = [fabStyle, helpers.circle(fabSize), shadowStyle];
        return (
            <TouchableOpacity>
                <View
                    onStartShouldSetResponderCapture={() => { imagePicker.test(); return false; }}
                    style={fabContainer} pointerEvents="box-only">
                    <View style={s}>
                        {icons.white('add')}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
