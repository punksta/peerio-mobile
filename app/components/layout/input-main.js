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
    @observable hasText = false;
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
        this.value.length ? this.hasText = true : this.hasText = false;
    }

    plus() {
    }

    send() {
        this.props.send(this.value);
        this.value = '';
        this.hasText = false;
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
                    alignItems: 'center'
                }}>
                {icons.dark('add-circle-outline', this.plus, {
                    paddingRight: 24
                })}
                <View style={{ flex: 1, alignItems: 'center'}}>
                    <AutoExpandingTextInput
                        onChangeText={this.onChangeText}
                        autoCorrect={false}
                        value={this.value}
                        placeholder="Enter text here"
                        enablesReturnKeyAutomatically
                        returnKeyType="default"
                        minHeight={56}
                        maxHeight={144}
                        onChangeHeight={this._onChangeHeight}
                        style={tiStyle}
                        ref={ref => { this.input = ref; }}
                    />
                </View>
                <View style={{
                    alignItems: 'center',
                    backgroundColor: styles.vars.checkboxActive,
                    borderRadius: 20,
                    justifyContent: 'center',
                    height: 40,
                    marginRight: 8,
                    width: 40
                     }}>
                    {//this.hasText ?
                        // negative margins because of icon padding set in icons component.
                        icons.white('send', this.send, { width: 24, height: 24, margin: -12 })
                        //: icons.white('thumb-up', this.send, { width: 24, height: 24, margin: -12 })
                    }
                </View>
            </View>
        );
    }
}


InputMain.propTypes = {
    value: React.PropTypes.any,
    send: React.PropTypes.func.isRequired
};
