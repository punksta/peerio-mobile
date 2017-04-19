import React, { Component } from 'react';
import { View, PanResponder, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { tx } from '../utils/translator';
import AutoExpandingTextInput from '../controls/auto-expanding-textinput';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import uiState from './ui-state';

@observer
export default class InputMain extends Component {
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

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (/* evt, gestureState */) => {
                requestAnimationFrame(() => {
                    this.input.focus();
                });
                return true;
            }
        });
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
        if (!uiState.isAuthenticated) return;
        this.hasText ? this.props.send(this.value) : this.props.sendAck();
        this.value = '';
    }

    setFocus() {
        this.input.ti.focus();
    }

    _onChangeHeight(/* before, after */) {
        // console.log('before: ' + before + ' after: ' + after);
    }

    render() {
        const tiStyle = {
            borderWidth: 0,
            borderColor: 'red',
            fontSize: 14
        };

        const iconStyle = { width: 24, height: 24, margin: -12 };
        const icon = icons.white(this.hasText ? 'send' : 'thumb-up', this.send, iconStyle);
        const outerStyle = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center'
        };
        const autoExpandingInputContainerStyle = {
            flex: 1,
            flexGrow: 1,
            alignItems: 'stretch'
        };
        const sendIconStyle = {
            alignItems: 'center',
            backgroundColor: uiState.isAuthenticated ? vars.checkboxActive : vars.checkboxIconInactive,
            borderRadius: 20,
            justifyContent: 'center',
            height: 40,
            marginRight: 8,
            width: 40
        };
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
                        placeholder={tx('title_chatPlaceholder')}
                        enablesReturnKeyAutomatically
                        returnKeyType="default"
                        minHeight={56}
                        maxHeight={144}
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
    value: React.PropTypes.any,
    plus: React.PropTypes.func.isRequired,
    send: React.PropTypes.func.isRequired,
    sendAck: React.PropTypes.func.isRequired
};
