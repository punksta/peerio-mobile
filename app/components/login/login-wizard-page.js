import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { tu } from '../utils/translator';
import Button from '../controls/button';
import { vars, wizard } from '../../styles/styles';

@observer
export default class LoginWizardPage extends Component {
    button(text, onPress, hidden) {
        const buttonContainer = {
            marginVertical: 20,
            alignItems: 'stretch',
            backgroundColor: vars.bg,
            opacity: hidden ? 0 : 1
        };
        const button = {
            padding: 12,
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.12)'
        };
        const buttonText = {
            fontWeight: 'bold'
        };
        return (
            <View style={buttonContainer} key={text}>
                {this._button(text, onPress, button, buttonText)}
            </View>
        );
    }

    _button(text, onPress, style, textStyle, disabled) {
        return (
            <Button style={[style, disabled && { opacity: 0.5 }]}
            testID={text}
            textStyle={textStyle}
            text={tu(text)}
            onPress={disabled ? null : onPress} />
        );
    }

    _footerButton(text, onPress, style, disabled) {
        const s = wizard.footer.button.base;
        return this._button(text, onPress, [s, style], { fontWeight: 'bold' }, disabled);
    }

    buttons() {
        return null;
    }

    items() {
        return null;
    }

    flexer(i) {
        const flexer = {
            flexGrow: 1, flexShrink: 2, justifyContent: 'flex-start', maxHeight: 192
        };
        return i && <View style={flexer}>{i}</View>;
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                {this.flexer(this.items())}
                {this.flexer(this.buttons())}
                <View style={{ flexGrow: 3 }} />
            </View>
        );
    }
}
