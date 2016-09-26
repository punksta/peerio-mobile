import React, { Component } from 'react';
import { LayoutAnimation, Picker } from 'react-native';
import { observer } from 'mobx-react/native';
import state from '../layout/state';

@observer
export default class LanguagePicker extends Component {
    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {
        return (
            <Picker
                style={{
                    flex: 0,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: state.pickerVisible ? undefined : 0
                }}>
                <Picker.Item label="English" value="en" />
                <Picker.Item label="French" value="fr" />
                <Picker.Item label="Spanish" value="es" />
                <Picker.Item label="Russian" value="ru" />
            </Picker>
        );
    }
}
