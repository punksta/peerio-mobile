import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { t } from 'peerio-translator';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';
import Circles from '../controls/circles';
import Center from '../controls/center';
import styles from '../../styles/styles';
import Util from '../helpers/util';

@observer
export default class Pin extends Component {
    @observable message = '';
    @observable enteredPin = '';
    @observable pin = '';
    @observable isConfirm = false;
    @observable circleW = 0;
    maxPinLength = 6;

    constructor(props) {
        super(props);
        this.layout = this.layout.bind(this);
        this.enter = this.enter.bind(this);
        this.shake = this.shake.bind(this);
    }

    componentWillMount() {
        this.initial();
    }

    check() {
        if (this.pin === this.enteredPin) {
            this.message = 'Confirmed!';
            this.props.onConfirm && this.props.onConfirm(this.enteredPin);
        } else {
            this.shake();
        }
    }

    confirm() {
        this.enteredPin = this.pin;
        this.pin = '';
        this.isConfirm = true;
        this.message = this.props.messageConfirm || t('passcode_confirm');
    }

    error(msg) {
        this.isConfirm = false;
        this.message = msg || this.props.messageWrong || t('passphrase_wrongpin');
    }

    initial() {
        this.enteredPin = '';
        this.pin = '';
        this.isConfirm = false;
        this.message = this.props.messageEnter || t('passcode_inputPlaceholder');
    }

    circle(index, text, subText) {
        const r = this.circleW || 60;
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
        if (this.pin.length >= this.maxPinLength) return;
        const pin = this.pin + num;
        this.pin = pin;
        if (this.pin.length === this.maxPinLength) {
            if (this.isConfirm) {
                this.check();
            } else {
                if (this.props.preventSimplePin) {
                    if (!Util.pinEntropyCheck(this.pin)) {
                        this.shake('Not strong enough');
                        return;
                    }
                }
                const callback = this.props.checkPin || this.confirm.bind(this);
                setTimeout(() => callback(this.pin, this), 200);
            }
        }
    }

    layout(e) {
        const w = e.nativeEvent.layout.width;
        this.circleW = w / 4;
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

    shake(msg) {
        this.error(msg);
        this.shaker.shake(500, 5, 5);
        setTimeout(() => this.initial(), 1000);
    }

    render() {
        const style = styles.pin;
        const p = (text, subText) => ({ text, subText });
        const body = (
            <View style={{ flex: 1 }}>
                <Animatable.View ref={v => { this.shaker = v; }}>
                    <Center style={style.message.container}>
                        <Text style={style.message.text}>
                            {this.message}
                        </Text>
                    </Center>
                </Animatable.View>
                <Circles count={this.maxPinLength} current={this.pin.length} fill />
                {this.row(0, [p(1), p(2, 'ABC'), p(3, 'DEF')])}
                {this.row(1, [p(4, 'GHI'), p(5, 'JKL'), p(6, 'MNO')])}
                {this.row(2, [p(7, 'PQR'), p(8, 'STU'), p(9, 'WXYZ')])}
                {this.row(3, [p(0)])}
            </View>
        );
        return (
            <View style={{
                flex: 1
            }} onLayout={this.layout}>
                {this.circleW ? body : null}
            </View>
        );
    }
}


Pin.propTypes = {
    onConfirm: React.PropTypes.func.isRequired,
    checkPin: React.PropTypes.func,
    messageEnter: React.PropTypes.string,
    messageWrong: React.PropTypes.string,
    messageConfirm: React.PropTypes.string,
    preventSimplePin: React.PropTypes.bool
};
