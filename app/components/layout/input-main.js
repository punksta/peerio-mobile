import React, { Component } from 'react';
import {
    TextInput,
    View,
    PanResponder
} from 'react-native';
import { observer } from 'mobx-react/native';
// import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Button from '../controls/button';
import styles from '../../styles/styles';
import icons from '../helpers/icons';
// import state from '../layout/state';

@observer
export default class InputMain extends Component {
    constructor(props) {
        super(props);
        this.plus = this.plus.bind(this);
        this.send = this.send.bind(this);
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

    plus() {
    }

    send() {
    }

    render() {
        return (
            <View
                pointerEvents="box-only"
                {...this.panResponder.panHandlers}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'flex-end'
                }}>
                {icons.dark('control-point', this.plus, { padding: 20 })}
                <TextInput
                    ref={ref => { this.input = ref; }}
                    maxHeight={120}
                    style={{ flex: 1, height: 20 }} />
                <Button
                    onPress={this.send}
                    text="SEND"
                    textStyle={{ color: styles.vars.bg }}
                    style={{ padding: 20 }}
                />
            </View>
        );
    }
}
