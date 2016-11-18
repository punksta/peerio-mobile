import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated
} from 'react-native';
import { observable, reaction, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { t } from '../utils/translator';
import state from '../layout/state';
import styles from '../../styles/styles';
import icons from '../helpers/icons';

@observer
export default class TextBox extends Component {
    @observable focused = false;
    @observable showSecret = false;

    @computed get value() {
        return this.props.state ? this.props.state[this.props.name] : this.props.value;
    }

    @computed get valid() {
        return this.props.state ? this.props.state[`${this.props.name}Valid`] : this.props.valid;
    }

    @computed get validationMessage() {
        return this.props.state ? this.props.state[`${this.props.name}ValidationMessage`] : this.props.validationMessage;
    }

    constructor(props) {
        super(props);
        this.blur = this.blur.bind(this);
        this.focus = this.focus.bind(this);
        this.changeText = this.changeText.bind(this);
        this.toggleSecret = this.toggleSecret.bind(this);

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
    }

    componentWillUnmount() {
        state.focusedTextBox = null;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.state) {
            // Object.assign(this.props, nextProps);
            this.forceUpdate();
            // this.value = nextProps.value;
            // this.validationMessage = nextProps.validationMessage;
        }
    }

    _callState(name, value) {
        const s = this.props.state;
        const n = `${this.props.name}${name}`;
        s && s[n] && s[n](value);
    }

    blur() {
        this._callState('OnBlur');
        state.focusedTextBox = null;
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
        this._callState('OnChange', tx);
        this.props.onChangeText && this.props.onChangeText(this.props.name, tx);
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
        const showSecretIcon = !this.props.secureTextEntry || this.showSecret ? null :
            <View style={style.iconContainer}>
                {icons.dark(
                    this.showSecret ? 'visibility-off' : 'visibility',
                    this.toggleSecret, style.icon)}
            </View>;
        const validationControl = !this.props.valid ? (
            <View
                pointerEvents="none"
                style={{ position: 'absolute', top: 0, right: 4 }}>
                <Text
                    style={{
                        color: styles.vars.txtAlert,
                        fontSize: 12,
                        backgroundColor: 'transparent'
                    }}>{t(this.validationMessage)}</Text>
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
        return (
            <View
                style={[style.shadow, { }]}>
                <View
                    style={{ backgroundColor: styles.vars.inputBg, overflow: 'hidden', borderRadius: 2 }}>
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
                            backgroundColor: 'transparent'
                        }}>
                        <TextInput
                            style={[style.textbox,
                            { height: 56, top: 0 }]}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={this.props.secureTextEntry && !this.showSecret}
                            ref={ti => { this.textinput = ti; }}
                            value={this.value}
                            onFocus={this.focus}
                            onBlur={this.blur}
                            onChangeText={this.changeText}
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
                    {infoControl}
                    {validationControl}
                </View>
            </View>
        );
    }
}

TextBox.propTypes = {
    onChangeText: React.PropTypes.func,
    value: React.PropTypes.any,
    state: React.PropTypes.any,
    valid: React.PropTypes.bool,
    validationMessage: React.PropTypes.string,
    hint: React.PropTypes.any.isRequired,
    info: React.PropTypes.any,
    name: React.PropTypes.string.isRequired,
    secureTextEntry: React.PropTypes.bool,
    lowerCase: React.PropTypes.bool,
    autoCapitalize: React.PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    autoCorrect: React.PropTypes.bool
};
