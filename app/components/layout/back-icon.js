import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import mainState from '../main/main-state';
import { helpers } from '../../styles/styles';

@observer
export default class BackIcon extends Component {
    render() {
        return (
            <TouchableOpacity onPress={() => mainState.back()}>
                <View style={{ flexDirection: 'row', paddingLeft: 6, backgroundColor: 'transparent' }}>
                    {icons.plainWhite('arrow-back')}
                </View>
            </TouchableOpacity>
        );
    }
}
