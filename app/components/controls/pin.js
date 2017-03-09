import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    ActivityIndicator,
    View
} from 'react-native';
import { t } from 'peerio-translator';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';
import Circles from '../controls/circles';
import Center from '../controls/center';
import icons from '../helpers/icons';
import styles, { vars } from '../../styles/styles';
import Util from '../helpers/util';

@observer
export default class Pin extends Component {
    @observable message = '';
    @observable enteredPin = '';
    @observable pin = '';
    @observable isConfirm = false;
    @observable circleW = 0;
    @observable isSpinner = false;
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

    get loading() {
        return this.isSpinner || this.props.inProgress;
    }

    check() {
        if (this.pin === this.enteredPin) {
            this.message = t('wait');
            this.isSpinner = true;
            this.props.onConfirm && this.props.onConfirm(this.enteredPin);
        } else {
            this.shake();
        }
    }

    confirm = () => {
        this.enteredPin = this.pin;
        this.pin = '';
        this.isConfirm = true;
        this.message = '';
        this.subTitle = t('passcode_confirm');
    }

    error(msg) {
        this.isConfirm = false;
        this.message = msg || this.props.messageWrong || t('passphrase_wrongpin');
    }

    initial() {
        this.enteredPin = '';
        this.pin = '';
        this.isSpinner = false;
        this.isConfirm = false;
        this.subTitle = this.props.messageInitial;
        this.message = '';
    }

    circle(key, text, subText, action) {
        const r = this.circleW || 60;
        if (!text) {
            const s = { width: r, height: r, alignItems: 'center', justifyContent: 'center' };
            return (
                <View style={s} key={key}>
                    { subText && icons.white(subText, action) }
                </View>
            );
        }
        const circle = styles.circle.create(r, {
            backgroundColor: vars.bg,
            borderColor: vars.highlight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: this.circleW,
            height: this.circleW
        });
        const circleHl = styles.circle.create(r, {
            backgroundColor: vars.midlight,
            width: this.circleW,
            height: this.circleW
        });
        return (
            <View style={circleHl} key={key}>
                <TouchableOpacity testID={`pin${text}`} onPress={() => this.enter(text)}>
                    <View style={circle}>
                        <Text style={{ color: vars.highlight, fontSize: 24 }}>{text}</Text>
                        <Text style={{ color: vars.midlight, fontSize: 12 }}>{subText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    enter(num) {
        if (this.loading) return;
        if (this.pin.length >= this.maxPinLength) return;
        const pin = this.pin + num;
        this.pin = pin;
        if (this.pin.length === this.maxPinLength) {
            if (this.props.onEnter) {
                this.isSpinner = true;
                this.props.onEnter(pin)
                    .then(r => {
                        console.log(`returned ${r}`);
                        return this.props.onSuccess && this.props.onSuccess(r);
                    })
                    .catch(e => {
                        console.log(`pin.js: error ${e}`);
                        this.error();
                        this.isSpinner = false;
                        this.shake();
                    })
                    .finally(() => (this.isSpinner = false));
                return;
            }
            if (this.isConfirm) {
                this.check();
            } else {
                if (this.props.preventSimplePin) {
                    if (!Util.pinEntropyCheck(this.pin)) {
                        this.shake(t('signup_pinIsNotStrongEnough'));
                        return;
                    }
                }
                const callback = this.props.checkPin || this.confirm;
                callback(this.pin, this);
            }
        }
    }

    backspace() {
        const l = this.pin.length;
        if (!l) return;
        this.pin = this.pin.substring(0, l - 1);
    }

    layout(e) {
        const w = e.nativeEvent.layout.width;
        this.circleW = w / 3.9;
    }

    row(index, items) {
        const circles = items.map((i, ci) => this.circle(`${index}${ci}`, i.text, i.subText, i.action));
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

    spinner(value) {
        this.isSpinner = value;
    }

    render() {
        const style = styles.pin;
        const p = (text, subText, action) => ({ text, subText, action });
        const bs = this.pin.length ? p(null, 'backspace', () => this.backspace()) : p();
        const inProgress = this.loading;
        const body = (
            <View style={{ flexGrow: 1, borderColor: 'green', borderWidth: 0, justifyContent: 'space-between' }}>
                <Text style={style.message.subTitle}>
                    {this.subTitle}
                </Text>
                <Animatable.View ref={v => { this.shaker = v; }} style={{ flex: 0, borderColor: 'blue', borderWidth: 0 }}>
                    <Center style={style.message.container}>
                        <Text style={style.message.text}>
                            {this.message}
                        </Text>
                    </Center>
                    <View style={{ height: 40, flexDirection: 'column' }}>
                        { inProgress ?
                            <View style={{ flex: 1, alignSelf: 'center' }}>
                                <ActivityIndicator style={{ marginTop: -6 }} color={vars.highlight} />
                            </View> :
                            <Circles count={this.maxPinLength} current={this.pin.length} fill empty={this.isConfirm} /> }
                    </View>
                </Animatable.View>
                <View style={{ flexGrow: 1,
                    opacity: inProgress ? 0.5 : 1,
                    borderWidth: 0,
                    borderColor: 'yellow',
                    marginTop: 24,
                    marginLeft: 16,
                    marginRight: 16 }}>
                    {this.row(0, [p(1), p(2, `ABC`), p(3, `DEF`)])}
                    {this.row(1, [p(4, `GHI`), p(5, `JKL`), p(6, `MNO`)])}
                    {this.row(2, [p(7, `PQRS`), p(8, `TUV`), p(9, `WXYZ`)])}
                    {this.row(3, [p(), p(`0`), bs])}
                </View>
            </View>
        );
        return (
            <View style={{
                flex: 1,
                flexGrow: 1
            }} onLayout={this.layout}>
                {this.circleW ? body : null}
            </View>
        );
    }
}


Pin.propTypes = {
    onConfirm: React.PropTypes.func,
    onEnter: React.PropTypes.func,
    onSuccess: React.PropTypes.func,
    checkPin: React.PropTypes.func,
    messageEnter: React.PropTypes.string,
    messageWrong: React.PropTypes.string,
    messageConfirm: React.PropTypes.string,
    messageInitial: React.PropTypes.string,
    preventSimplePin: React.PropTypes.bool,
    inProgress: React.PropTypes.bool
};
