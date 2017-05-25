import React, { Component } from 'react';
import {
    Text, Animated, TouchableWithoutFeedback
} from 'react-native';
import { reaction, computed } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { warnings, warningStates } from '../../lib/icebear';
import { vars } from '../../styles/styles';

export default class SnackbarBase extends SafeComponent {
    constructor(props) {
        super(props);
        this.animatedHeight = new Animated.Value(0);
    }

    componentDidMount() {
        this.show();
        reaction(() => this.isVisible, vis => {
            vis ? this.show() : this.hide();
        });
    }

    // to override
    getText() { return null; }

    get isVisible() {
        const w = warnings.current;
        return !!(w && w.level === this.level && w.state === warningStates.SHOWING) && this.getText();
    }

    // to override
    getShowDelay() {
        return 0;
    }

    show() {
        if (!this.isVisible) {
            this._timer = null;
            return;
        }
        if (this._timer) {
            this._timer = null;
            this.animate(vars.snackbarHeight);
            return;
        }
        this._timer = setTimeout(() => this.show(), this.getShowDelay());
    }

    hide(cb) {
        this.animate(0, () => {
            cb && cb();
            this.show();
        });
    }

    tap() {
        console.log('snackbar-base.js: tap');
        warnings.current.dismiss();
    }

    animate(toValue, cb) {
        const duration = vars.animatedDuration;
        Animated.timing(this.animatedHeight, { toValue, duration })
            .start(cb);
    }

    renderThrow() {
        const s = {
            backgroundColor: vars.snackbarBg,
            justifyContent: 'center',
            paddingLeft: 24,
            paddingRight: 24,
            overflow: 'hidden',
            height: this.animatedHeight
        };
        const textStyle = {
            color: vars.highlight
        };
        return (
            <TouchableWithoutFeedback onPress={() => this.tap()}>
                <Animated.View style={s}>
                    <Text style={textStyle}>{this.getText()}</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}
