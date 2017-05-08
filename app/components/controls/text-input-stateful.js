import React, { Component } from 'react';
import {
    TextInput, View
} from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';

@observer
export default class TextInputStateful extends Component {
    render() {
        const s = this.props.state;
        return (
            <View style={{ borderBottomColor: vars.bg, borderBottomWidth: 1 }}>
                <TextInput
                    testID={this.props.name}
                    style={{ height: 56, top: 0 }}
                    underlineColorAndroid={'transparent'}
                    value={s.value}
                    selectTextOnFocus
                    onChangeText={text => (s.value = text)}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    autoComplete={false}
                />
            </View>
        );
    }
}

TextInputStateful.propTypes = {
    returnKeyType: React.PropTypes.any,
    state: React.PropTypes.any.isRequired,
    name: React.PropTypes.string
};
