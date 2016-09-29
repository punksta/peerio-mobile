import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import TextBox from '../controls/textbox';
import Circles from '../controls/circles';
import Center from '../controls/center';
import styles from '../../styles/styles';

export default class Pin extends Component {
    constructor(props) {
        super(props);
        this.maxPinLength = 6;
        this.state = {
            message: '',
            pin: '',
            enteredPin: '',
            failNumber: 0,
            isConfirm: false,

            check: () => {
                if (this.state.pin === this.state.enteredPin) {
                    this.setState({ message: 'Confirmed!' });
                    this.props.onConfirm && this.props.onConfirm(this.state.enteredPin);
                } else {
                    this.shake();
                }
            },

            confirm: () => {
                this.setState({
                    enteredPin: this.state.pin,
                    pin: '',
                    isConfirm: true,
                    message: 'Confirm PIN'
                });
            },

            error: () => {
                this.setState({ isConfirm: false, message: 'Wrong PIN' });
            },

            initial: () => {
                this.setState({ isConfirm: false, pin: '', enteredPin: '', message: 'Enter PIN' });
            }
        };
        this.layout = this.layout.bind(this);
        this.shake = this.shake.bind(this);
    }

    componentWillMount() {
        this.state.initial();
    }

    circle(index, text, subText) {
        const r = this.state.circleW || 60;
        const circle = styles.circle.create(r, {
            backgroundColor: styles.vars.bg,
            borderColor: styles.vars.highlight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
        });
        const circleHl = styles.circle.create(r, {
            backgroundColor: styles.vars.midlight
        });
        return (
            <View style={circleHl} key={index}>
                <TouchableOpacity onPress={() => this.enter(text)}>
                    <View style={circle}>
                        <Text style={{ color: styles.vars.highlight, fontSize: r / 3 }}>{text}</Text>
                        <Text style={{ color: styles.vars.midlight, fontSize: r / 6 }}>{subText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    enter(num) {
        if (this.state.pin.length >= this.maxPinLength) return;
        const pin = this.state.pin + num;
        this.setState({
            pin
        }, () => {
            if (this.state.pin.length === this.maxPinLength) {
                if (this.state.isConfirm) {
                    this.state.check();
                } else {
                    setTimeout(() => this.state.confirm(), 200);
                }
            }
        });
    }

    layout(e) {
        const w = e.nativeEvent.layout.width;
        this.setState({
            circleW: w / 4
        });
    }

    row(index, items) {
        const circles = items.map((i, ci) => this.circle(ci, i.text, i.subText));
        return (
            <View key={index} style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: items.length === 1 ? 'center' : 'space-between'
            }}>
                {circles}
            </View>
        );
    }

    shake() {
        this.state.error();
        this.shaker.shake(500, 5, 5);
        setTimeout(() => this.state.initial(), 1000);
    }

    render() {
        const style = styles.pin;
        const circle = styles.circle.create(60, {
            backgroundColor: 'transparent',
            borderColor: 'white',
            borderWidth: 1
        });
        const p = (text, subText) => ({ text, subText });
        return (
            <View style={{
                flex: 1
            }} onLayout={this.layout}>
                <Animatable.View ref={v => { this.shaker = v; }}>
                    <Center style={style.message.container}>
                        <Text style={style.message.text}>
                            {this.state.message}
                        </Text>
                    </Center>
                </Animatable.View>
                <Circles count={this.maxPinLength} current={this.state.pin.length} fill />
                {this.row(0, [p(1), p(2, 'ABC'), p(3, 'DEF')])}
                {this.row(1, [p(4, 'GHI'), p(5, 'JKL'), p(6, 'MNO')])}
                {this.row(2, [p(7, 'PQR'), p(8, 'STU'), p(9, 'WXYZ')])}
                {this.row(3, [p(0)])}
            </View>
        );
    }
}


Pin.propTypes = {
    onConfirm: React.PropTypes.func.isRequired
};
