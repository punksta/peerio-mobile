import React from 'react';
import { View, Text, TextInput, LayoutAnimation, TouchableOpacity, Platform } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { t } from '../utils/translator';
import uiState from '../layout/ui-state';
import { vars, textbox } from '../../styles/styles';
import icons from '../helpers/icons';

export default class TextBox extends SafeComponent {
    @observable focused = false;
    @observable showSecret = false;
    @observable _value = '';
    @observable start = 0;
    @observable end = 0;

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

    componentDidMount() {
        reaction(() => this.value, text => {
            if (this._value === text) return;
            this._value = text;
        }, true);
        reaction(() => [this.focused, this.value], () => {
            LayoutAnimation.easeInEaseOut();
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

    blur = () => {
        // console.log('textbox.js: blur');
        this._callState(`OnBlur`);
        uiState.focusedTextBox = null;
        this.focused = false;
    }

    changeText = (text) => {
        let tx = text;
        const { Version, OS } = Platform;
        if (OS !== 'android' || Version > 22) {
            tx = this.props.lowerCase ? text.toLowerCase() : text;
        }
        if (this.props.state) {
            this.props.state[this.props.name] = tx;
        } else {
            this.props.value = tx;
        }
        this._callState(`OnChange`, tx);
        this.props.onChangeText && this.props.onChangeText(this.props.name, tx);
    }

    focus = () => {
        uiState.focusedTextBox = this.textinput;
        this.textinput.focus();
        this.focused = true;
    }


    onSelectionChange = ({ nativeEvent: { selection: { start, end } } }) => {
        if (this._skip) {
            console.log(`onSelectionChange: skip ${start}, ${end}`);
            this._skip = false;
            return;
        }
        console.log(`onSelectionChange: ${start}, ${end}`);
        this.start = start;
        this.end = end;
    }

    toggleSecret = () => {
        // we don't give user the ability to hide passphrase again, because Apple
        this.showSecret = true;
        // prevent cursor skip
        this._skip = true;
    }

    submit = () => {
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

    get validationControl() {
        return !this.valid ? (
            <Text
                style={{
                    height: 14,
                    color: vars.highlight,
                    fontSize: 12,
                    backgroundColor: 'transparent'
                }}>{t(this.validationMessage)}</Text>
        ) : (
            <View style={{ height: 14 }} />
        );
    }

    get secretIcon() {
        return !this.props.secureTextEntry || this.showSecret ? null : (
            <View style={textbox.iconContainer}>
                {icons.dark(
                    this.showSecret ? 'visibility-off' : 'visibility',
                    this.toggleSecret, { backgroundColor: 'transparent' })}
            </View>
        );
    }

    get hint() {
        const style = (this.focused || this.value && this.value.length) ?
            textbox.hint.small : textbox.hint.normal;
        return (
            <View key={`hint`}
                pointerEvents="none"
                style={[style.container]}>
                <Text style={style.text}>
                    {this.props.hint}
                </Text>
            </View>
        );
    }

    renderThrow() {
        // console.log('re-render');
        const returnKeyType = this.props.returnKeyType || 'default';
        const style = this.focused ? textbox.focused : textbox.blurred;
        const icAlert = this.validationMessage ? textbox.alertVisible : textbox.alertInvisible;
        let fontSize = vars.font.size.normal;
        const astl = this.props.autoShrinkTextLimit;
        if (astl && this.value && this.value.length && astl < this.value.length) {
            fontSize = Math.floor(fontSize * astl / this.value.length);
        }
        const { secretIcon } = this;
        const { start, end } = this;
        return (
            <View style={textbox.outerContainer}>
                <View style={[style.outer]}>
                    <View
                        style={[style.radius]}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            pressRetentionOffset={vars.retentionOffset}
                            pointerEvents={!this.focused ? undefined : 'none'}
                            style={[style.touchable]}
                            testID={`${this.props.name}_outer`}
                            onPress={this.focus} />
                        {this.hint}
                        <View
                            pointerEvents={this.focused ? undefined : 'none'}
                            style={[textbox.inputContainer, icAlert]}>
                            <TextInput
                                keyboardType={this.props.keyboardType}
                                testID={`${this.props.testID || this.props.name}`}
                                style={[style.textbox, { fontSize },
                                { height: vars.inputPaddedHeight, top: 0, marginRight: this.secretIcon ? 42 : 0 }]}
                                ref={ref => (this.textinput = ref)}
                                underlineColorAndroid={'transparent'}
                                returnKeyType={returnKeyType}
                                secureTextEntry={this.props.secureTextEntry && !this.showSecret}
                                value={this._value}
                                maxLength={this.props.maxLength}
                                selection={{ start, end }}
                                onBlur={this.blur}
                                onChangeText={this.changeText}
                                onSubmitEditing={this.submit}
                                onSelectionChange={this.onSelectionChange}
                                autoCorrect={false}
                                autoComplete={false}
                                autoCapitalize="none"
                            />
                        </View>
                        {secretIcon}
                    </View>
                </View>
                {this.validationControl}
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
    testID: React.PropTypes.string,
    returnKeyType: React.PropTypes.any,
    keyboardType: React.PropTypes.any,
    secureTextEntry: React.PropTypes.bool,
    lowerCase: React.PropTypes.bool,
    autoCapitalize: React.PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    autoCorrect: React.PropTypes.bool,
    autoShrinkTextLimit: React.PropTypes.number,
    maxLength: React.PropTypes.number
};
