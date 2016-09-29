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
        this.state = {};
        this.layout = this.layout.bind(this);
        this.shake = this.shake.bind(this);
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
                <TouchableOpacity onPress={this.shake}>
                    <View style={circle}>
                        <Text style={{ color: styles.vars.highlight, fontSize: r / 3 }}>{text}</Text>
                        <Text style={{ color: styles.vars.midlight, fontSize: r / 6 }}>{subText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
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
        this.shaker.shake(500, 5, 5);
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
                            PIN confirmed
                        </Text>
                    </Center>
                </Animatable.View>
                <Circles count={6} current={4} fill />
                {this.row(0, [p(1), p(2, 'ABC'), p(3, 'DEF')])}
                {this.row(1, [p(4, 'GHI'), p(5, 'JKL'), p(6, 'MNO')])}
                {this.row(2, [p(7, 'PQR'), p(8, 'STU'), p(9, 'WXYZ')])}
                {this.row(3, [p(0)])}
            </View>
        );
    }
}
