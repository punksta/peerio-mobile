import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import AutoExpandingTextInput from '../controls/auto-expanding-textinput';
import { inputMain } from '../../styles/styles';
import icons from '../helpers/icons';
import { uiState, chatState } from '../states';

@observer
export default class InputMain extends SafeComponent {
    @observable value = '';
    get hasText() {
        return this.value && this.value.length;
    }
    constructor(props) {
        super(props);
        this.value = this.props.value;
        this.plus = this.plus.bind(this);
        this.send = this.send.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.value = nextProps.value;
        }
    }

    onChangeText(text) {
        this.value = text;
    }

    plus() {
        this.props.plus();
    }

    send() {
        if (!this.canSend) return;
        this.hasText ? this.props.send(this.value) : this.props.sendAck();
        this.value = '';
    }

    setFocus() {
        this.input.ti.focus();
    }

    get canSend() {
        return this.props.canSend || uiState.isAuthenticated && (this.hasText ? chatState.canSend : chatState.canSendAck);
    }

    renderThrow() {
        const { tiStyle, iconStyle, outerStyle, autoExpandingInputContainerStyle,
            sendIconStyleNormal, sendIconStyleActive } = inputMain;
        const icon = icons.white(this.hasText ? 'send' : 'thumb-up', this.send, iconStyle);
        const sendIconStyle = this.canSend ? sendIconStyleActive : sendIconStyleNormal;
        const chatName = chatState.title;
        return (
            <View style={outerStyle}>
                {icons.dark('add-circle-outline', this.plus, {
                    paddingLeft: 4,
                    paddingRight: 24
                })}
                <View style={autoExpandingInputContainerStyle}>
                    <AutoExpandingTextInput
                        onChangeText={this.onChangeText}
                        value={this.value}
                        placeholder={tx('title_messageInputPlaceholder', { chatName })}
                        enablesReturnKeyAutomatically
                        returnKeyType="default"
                        minHeight={56}
                        maxHeight={146}
                        onChangeHeight={this._onChangeHeight}
                        style={tiStyle}
                        ref={ref => { this.input = ref; }}
                    />
                </View>
                <TouchableOpacity onPress={this.send}>
                    <View style={sendIconStyle}>
                        {icon}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


InputMain.propTypes = {
    value: PropTypes.any,
    plus: PropTypes.func.isRequired,
    send: PropTypes.func.isRequired,
    sendAck: PropTypes.func.isRequired
};
