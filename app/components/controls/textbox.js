import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    LayoutAnimation
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import state from '../layout/state';
import styles from '../../styles/styles';
import icons from '../helpers/icons';

@observer
export default class TextBox extends Component {
    @observable focused = false;
    @observable showSecret = false;
    @observable value = '';
    @observable validationMessage = '';

    constructor(props) {
        super(props);
        this.value = this.props.value;
        this.validationMessage = this.props.validationMessage;
        this.blur = this.blur.bind(this);
        this.focus = this.focus.bind(this);
        this.changeText = this.changeText.bind(this);
        this.toggleSecret = this.toggleSecret.bind(this);
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount() {
        state.focusedTextBox = null;
    }

    componentWillReceiveProps(nextProps) {
        this.value = nextProps.value;
        this.validationMessage = nextProps.validationMessage;
    }

    blur() {
        state.focusedTextBox = null;
        requestAnimationFrame(() => {
            this.focused = false;
        });
    }

    changeText(text) {
        this.value = text;
        this.props.onChangeText(this.props.name, text);
    }

    focus() {
        state.focusedTextBox = this.textinput;
        requestAnimationFrame(() => {
            this.focused = true;
        });
    }

    toggleSecret() {
        // we don't give user the ability to hide passphrase again, because Apple
        this.showSecret = true;
    }

    render() {
        const style = this.focused ? styles.input.active : styles.input.normal;
        const hint = this.focused || this.props.value && this.props.value.length ?
            styles.input.hint.scaled : styles.input.hint.full;
        const showSecretIcon = !this.props.secureTextEntry ? null :
            <View style={style.iconContainer}>
                {icons.dark(
                    this.showSecret ? 'visibility-off' : 'visibility',
                    this.toggleSecret, style.icon)}
            </View>;
        const validationControl = (this.value && this.value.length && !this.props.valid) ? (
            <View
                pointerEvents="none"
                style={{ position: 'absolute', top: 0, right: 4 }}>
                <Text
                    style={{
                        color: styles.vars.txtAlert,
                        fontSize: 12,
                        backgroundColor: 'transparent'
                    }}>{this.validationMessage}</Text>
            </View>
        ) : null;
        const infoControl = this.props.info ? (
            <Text style={{
                backgroundColor: 'transparent',
                color: styles.vars.midlight,
                position: 'absolute',
                fontSize: 10,
                marginTop: 2
            }}>Optional</Text>
        ) : null;
        return (
            <View
                style={style.shadow}>
                <View
                    style={{ backgroundColor: styles.vars.inputBg }}>
                    <TouchableOpacity
                        onPress={() => { this.focus(); this.textinput.focus(); }}>
                        <View
                            pointerEvents="none"
                            style={{
                                height: styles.vars.inputHeight,
                                backgroundColor: this.focused ? 'transparent' : styles.vars.subtleBg }} />
                    </TouchableOpacity>
                    <View
                        pointerEvents="none"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'transparent' }}>
                        <TextInput
                            secureTextEntry={this.props.secureTextEntry && !this.showSecret}
                            ref={t => { this.textinput = t; }}
                            style={style.textbox}
                            value={this.value}
                            onFocus={this.focus}
                            onBlur={this.blur}
                            onChangeText={this.changeText}
                            autoCapitalize={this.props.autoCapitalize || 'none'}
                            autoCorrect={false}
                        />
                    </View>
                    {showSecretIcon}
                    <View
                        pointerEvents="none"
                        style={hint}>
                        <Text style={styles.input.hint.text}>
                            {this.props.hint}
                        </Text>
                    </View>
                    {infoControl}
                    {validationControl}
                </View>
            </View>
        );
    }
}

TextBox.propTypes = {
    onChangeText: React.PropTypes.func.isRequired,
    value: React.PropTypes.any.isRequired,
    valid: React.PropTypes.bool,
    validationMessage: React.PropTypes.string,
    hint: React.PropTypes.string.isRequired,
    info: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    secureTextEntry: React.PropTypes.bool,
    autoCapitalize: React.PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    autoCorrect: React.PropTypes.bool
};
