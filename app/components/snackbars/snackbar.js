import React, { Component } from 'react';
import {
    Text, Animated, TouchableWithoutFeedback
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import snackbarState from './snackbar-state';
import styles from '../../styles/styles';

@observer
export default class Snackbar extends Component {
    constructor(props) {
        super(props);
        this.animatedHeight = new Animated.Value(0);
    }

    @observable visibleText = false;

    componentDidMount() {
        this.show();
    }

    // toggle() {
    //     this.visible ? this.hide() : this.show();
    //     setTimeout(() => this.toggle(), 3000);
    // }

    show() {
        if (!snackbarState.text) {
            return;
        }
        this.animate(styles.vars.snackbarHeight);
        this.visible = true;
    }

    hide(cb) {
        this.visible = false;
        this.animate(0, () => {
            cb && cb();
            this.show();
        });
    }

    tap() {
        this.hide(() => snackbarState.pop());
    }

    animate(toValue, cb) {
        const duration = styles.vars.animatedDuration;
        Animated.timing(this.animatedHeight, { toValue, duration })
            .start(cb);
    }

    render() {
        const s = {
            backgroundColor: styles.vars.snackbarBg,
            justifyContent: 'center',
            paddingLeft: styles.vars.iconPadding,
            paddingRight: styles.vars.iconPadding,
            overflow: 'hidden',
            height: this.animatedHeight
        };
        const textStyle = {
            color: styles.vars.highlight
        };
        return (
            <TouchableWithoutFeedback onPress={() => this.tap()}>
                <Animated.View style={s}>
                    <Text style={textStyle}>{snackbarState.text}</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}
