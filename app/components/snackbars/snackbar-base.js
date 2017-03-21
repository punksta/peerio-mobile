import React, { Component } from 'react';
import {
    Text, Animated, TouchableWithoutFeedback
} from 'react-native';
import { reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';

@observer
export default class SnackbarBase extends Component {
    constructor(props) {
        super(props);
        this.animatedHeight = new Animated.Value(0);
        reaction(() => this.getText(), text => {
            text ? this.show() : this.hide();
        });
    }

    componentDidMount() {
        this.show();
    }

    // to override
    get autoDismiss() { return false; }

    // to override
    getText() {
        return null;
    }

    // to override
    getShowDelay() {
        return 0;
    }

    show() {
        if (!this.getText()) {
            this._timer = null;
            return;
        }
        if (this._timer) {
            this._timer = null;
            this.animate(vars.snackbarHeight);
            this.visible = true;
            return;
        }
        this._timer = setTimeout(() => this.show(), this.getShowDelay());
        if (this.autoDismiss) setTimeout(() => this.tap(), 5000);
    }

    hide(cb) {
        this.visible = false;
        this.animate(0, () => {
            cb && cb();
            this.show();
        });
    }

    tap() {
        console.log('snackbar-base.js: tap');
    }

    animate(toValue, cb) {
        const duration = vars.animatedDuration;
        Animated.timing(this.animatedHeight, { toValue, duration })
            .start(cb);
    }

    render() {
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
