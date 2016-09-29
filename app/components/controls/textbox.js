import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TouchableHighlight,
    LayoutAnimation
} from 'react-native';
import state from '../layout/state';
import styles from '../../styles/styles';
import icons from '../helpers/icons';

export default class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
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

    blur() {
        state.focusedTextBox = null;
        requestAnimationFrame(() => {
            this.setState({ focused: false });
        });
    }

    changeText(text) {
        this.setState({ value: text });
        this.props.onChangeText(this.props.name, text);
    }

    focus() {
        state.focusedTextBox = this.textinput;
        requestAnimationFrame(() => {
            this.setState({ focused: true });
        });
    }

    toggleSecret() {
        // we don't give user the ability to hide passphrase again, because Apple
        this.setState({ showSecret: true });
    }

    render() {
        const style = this.state.focused ? styles.input.active : styles.input.normal;
        let hint = this.state.focused || this.props.value && this.props.value.length ?
            styles.input.hint.scaled : styles.input.hint.full;
        const showSecretIcon = !this.props.secureTextEntry ? null :
            <View style={style.iconContainer}>
                {icons.dark(
                    this.state.showSecret ? 'visibility-off' : 'visibility',
                    this.toggleSecret, style.icon)}
            </View>;
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
                                backgroundColor: this.state.focused ? 'transparent' : styles.vars.subtleBg }} />
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
                            secureTextEntry={this.props.secureTextEntry && !this.state.showSecret}
                            ref={t => { this.textinput = t; }}
                            style={style.textbox}
                            value={this.state.value}
                            onFocus={this.focus}
                            onBlur={this.blur}
                            onChangeText={this.changeText}
                            autoCapitalize={this.props.autoCapitalize || 'none'}
                            autoCorrect={this.props.autoCorrect}
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
                </View>
            </View>
        );
    }
}

TextBox.propTypes = {
    onChangeText: React.PropTypes.func.isRequired,
    value: React.PropTypes.any.isRequired,
    hint: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    secureTextEntry: React.PropTypes.bool,
    autoCapitalize: React.PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    autoCorrect: React.PropTypes.bool
};
