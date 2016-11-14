import React, { Component } from 'react';
import {
    View,
    PanResponder
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import AutoExpandingTextInput from '../controls/auto-expanding-textinput';
import Button from '../controls/button';
import styles from '../../styles/styles';
import icons from '../helpers/icons';
import mainState from '../main/main-state';

@observer
export default class InputMain extends Component {
    @observable value = '';
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
        this.value = nextProps.value;
    }

    onChangeText(text) {
        this.value = text;
    }

    plus() {
    }

    send() {
        this.props.send(this.value);
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
            flex: 1,
            fontSize: 14
        };
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'flex-end'
                }}>
                {icons.dark('control-point', this.plus, { padding: 20 })}
                <View style={{ flex: 1 }}>
                    <AutoExpandingTextInput
                        onChangeText={this.onChangeText}
                        autoCorrect={false}
                        value={this.value}
                        placeholder="Enter text here"
                        enablesReturnKeyAutomatically
                        returnKeyType="default"
                        minHeight={40}
                        maxHeight={144}
                        onChangeHeight={this._onChangeHeight}
                        style={tiStyle}
                        ref={ref => { this.input = ref; }}
                    />
                </View>
                <Button
                    onPress={this.send}
                    text="SEND"
                    textStyle={{ color: mainState.canSend ? styles.vars.bg : '#EFEFEF' }}
                    style={{ padding: 20 }}
                />
            </View>
        );
    }
}


InputMain.propTypes = {
    value: React.PropTypes.any,
    send: React.PropTypes.func.isRequired
};
