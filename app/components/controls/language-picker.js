import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { observer } from 'mobx-react/native';
import { Picker } from 'react-native';
import state from '../layout/state';

@observer
export default class LanguagePicker extends Component {
    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {
        console.log(state);
        return (
            <Picker style={{
                flex: 0,
                backgroundColor: '#fff',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: state.pickerVisible ? undefined : 0
            }}>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
            </Picker>
        );
    }
}


