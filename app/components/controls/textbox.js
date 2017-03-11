import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated
} from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { t } from '../utils/translator';
import uiState from '../layout/ui-state';
import styles, { vars } from '../../styles/styles';
import icons from '../helpers/icons';

@observer
export default class TextBox extends Component {
    @observable focused = false;
    @observable showSecret = false;
    get nextField() {
        const byOrder = this.props.state.byOrder;
        const byName = this.props.state.byName;
        if (!byOrder || !byName) return null;
        const name = this.props.name;
        return byOrder[byName[name] + 1];
    }

    get value() {
        return this.props.state ?
            this.props.state[this.props.name] : this.props.value;
    }

    get valid() {
        return this.props.state ?
            this.props.state[`${this.props.name}Valid`] : this.props.valid;
    }

    get validationMessage() {
        return this.props.state ?
            this.props.state[`${this.props.name}ValidationMessage`] : this.props.validationMessage;
    }

    constructor(props) {
        super(props);
        this.blur = this.blur.bind(this);
        this.focus = this.focus.bind(this);
        this.changeText = this.changeText.bind(this);
        this.toggleSecret = this.toggleSecret.bind(this);
        this.submit = this.submit.bind(this);

        const scaleFrom = 1;
        const translateFrom = 0;
        const translateFromY = 14;
        this.animatedHintTranslate = new Animated.Value(translateFrom);
        this.animatedHintTranslateY = new Animated.Value(translateFrom);
        this.animatedHintScale = new Animated.Value(scaleFrom);
        reaction(() => [this.focused, this.value], () => {
            const v = this.focused || (this.value && this.value.length);
            const duration = 300;
            const scaleTo = 0.8;
            const width = 200;
            const translateTo = -width * (1 - scaleTo) / 2;
            const translateToY = 0;
            Animated.parallel([
                Animated.timing(this.animatedHintTranslate, { toValue: v ? translateTo : translateFrom, duration }),
                Animated.timing(this.animatedHintTranslateY, { toValue: v ? translateToY : translateFromY, duration }),
                Animated.timing(this.animatedHintScale, { toValue: v ? scaleTo : scaleFrom, duration })
            ]).start();
        }, true);
        const s = this.props.state;
        if (s) {
            // add focus callback so that we can be focused on Next action
            const focus = s.focus || {};
            focus[this.props.name] = () => this.focus();
            s.focus = focus;
        }
    }

    componentWillUnmount() {
        uiState.focusedTextBox = null;
    }

    _callState(name, value) {
        const s = this.props.state;
        const n = `${this.props.name}${name}`;
        s && s[n] && s[n](value);
    }

    blur() {
        console.log('textbox.js: blur');
        this._callState(`OnBlur`);
        uiState.focusedTextBox = null;
        requestAnimationFrame(() => {
            this.focused = false;
        });
    }

    changeText(text) {
        const tx = this.props.lowerCase ? text.toLowerCase() : text;
        if (this.props.state) {
            this.props.state[this.props.name] = tx;
        } else {
            this.props.value = tx;
        }
        this._callState(`OnChange`, tx);
        this.props.onChangeText && this.props.onChangeText(this.props.name, tx);
    }

    focus() {
        uiState.focusedTextBox = this.textinput;
        this.textinput.focus();
        requestAnimationFrame(() => {
            this.focused = true;
        });
    }

    toggleSecret() {
        // we don't give user the ability to hide passphrase again, because Apple
        this.showSecret = true;
    }

    submit() {
        const s = this.props.state;
        if (!s) return;
        // if no next field, we are the last one in form
        const nextField = this.nextField;
        if (!this.nextField) {
            this.props.onSubmit && this.props.onSubmit();
            return;
        }
        // we hope that other textbox actually added "focus" handler
        const focuser = s.focus[nextField];
        focuser && focuser();
    }

    validationControl() {
        return !this.valid && (
            <Text
                style={{
                    color: vars.highlight,
                    fontSize: 12,
                    backgroundColor: 'transparent'
                }}>{t(this.validationMessage)}</Text>
        );
    }

    render() {
        const returnKeyType = this.props.returnKeyType || 'default';
        const style = this.focused ? styles.input.active : styles.input.normal;
        const hint = this.focused || this.props.value && this.props.value.length ?
            styles.input.hint.scaled : styles.input.hint.full;
        const showSecretIcon = !this.props.secureTextEntry || this.showSecret ? null :
            (<View style={style.iconContainer}>
                {icons.dark(
                    this.showSecret ? 'visibility-off' : 'visibility',
                    this.toggleSecret, style.icon)}
            </View>);
        const hintStyle = [styles.input.hint.text, {
            borderWidth: 0,
            width: 200,
            borderColor: 'red',
            transform: [
                { scale: this.animatedHintScale },
                { translateX: this.animatedHintTranslate },
                { translateY: this.animatedHintTranslateY }
            ]
        }];
        const hintContainer = [hint, {
            flex: 1,
            alignItems: 'flex-start',
            padding: 0,
            borderWidth: 0,
            borderColor: 'yellow',
            left: 8,
            right: 0,
            top: 4,
            bottom: 0,
            position: 'absolute'
        }];
        const inputContainer = {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent'
        };
        const icAlert = this.validationMessage ? {
            borderBottomColor: vars.txtAlert,
            borderBottomWidth: 2
        } : null;
        let fontSize = 14;
        const astl = this.props.autoShrinkTextLimit;
        if (astl && this.value && this.value.length && astl < this.value.length) {
            fontSize = Math.floor(fontSize * astl / this.value.length);
        }
        return (
            <View
                style={[style.shadow, { borderColor: 'green', borderWidth: 0 }]}>
                <View
                    style={{ backgroundColor: vars.inputBg, overflow: 'hidden', borderRadius: 2 }}>
                    <TouchableOpacity
                        onPress={() => { this.focus(); }}>
                        <View
                            pointerEvents="none"
                            style={{
                                height: vars.inputHeight,
                                backgroundColor: this.focused ? 'transparent' : vars.subtleBg }} />
                    </TouchableOpacity>
                    <View
                        style={[inputContainer, icAlert]}>
                        <TextInput
                            keyboardType={this.props.keyboardType}
                            testID={this.props.name}
                            style={[style.textbox, { fontSize },
                            { height: vars.inputPaddedHeight, top: 0 }]}
                            underlineColorAndroid={'transparent'}
                            returnKeyType={returnKeyType}
                            secureTextEntry={this.props.secureTextEntry && !this.showSecret}
                            ref={ti => { this.textinput = ti; }}
                            value={this.value}
                            onFocus={this.focus}
                            onBlur={this.blur}
                            onChangeText={this.changeText}
                            onSubmitEditing={this.submit}
                            autoCapitalize={this.props.autoCapitalize || 'none'}
                            autoCorrect={false}
                            autoComplete={false}
                        />
                    </View>
                    {showSecretIcon}
                    <View
                        pointerEvents="none"
                        style={hintContainer}>
                        <Animated.Text style={hintStyle}>
                            {this.props.hint}
                        </Animated.Text>
                    </View>
                </View>
                {this.validationControl()}
            </View>
        );
    }
}

TextBox.propTypes = {
    onChangeText: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    value: React.PropTypes.any,
    state: React.PropTypes.any,
    valid: React.PropTypes.bool,
    validationMessage: React.PropTypes.string,
    hint: React.PropTypes.any.isRequired,
    info: React.PropTypes.any,
    name: React.PropTypes.string.isRequired,
    returnKeyType: React.PropTypes.any,
    keyboardType: React.PropTypes.any,
    secureTextEntry: React.PropTypes.bool,
    lowerCase: React.PropTypes.bool,
    autoCapitalize: React.PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    autoCorrect: React.PropTypes.bool,
    autoShrinkTextLimit: React.PropTypes.number
};
