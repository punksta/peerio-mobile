import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import { vars, helpers } from '../../styles/styles';
import icons from '../helpers/icons';
import imagePicker from '../helpers/imagepicker';

const fabContainer = {
    position: 'absolute',
    right: vars.fabRight,
    bottom: vars.fabBottom,
    padding: 20,
    borderColor: 'red',
    borderWidth: 0
};

const fabStyle = {
    flex: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7D00'
};

const shadowStyle = {
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
        height: 0,
        width: 0
    }
};

export default class Fab extends Component {
    fabAction() {
        imagePicker.test();
    }

    render() {
        const s = [fabStyle, helpers.circle(vars.fabSize), shadowStyle];
        return (
            <TouchableOpacity
                onPress={() => imagePicker.test()}>
                <View
                    style={fabContainer} pointerEvents="box-only">
                    <View style={s}>
                        {icons.white('add')}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
