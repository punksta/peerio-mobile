import React, { Component } from 'react';
import {
    Text, Animated, TouchableWithoutFeedback
} from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';

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
            this.animate(styles.vars.snackbarHeight);
            this.visible = true;
            return;
        }
        this._timer = setTimeout(() => this.show(), this.getShowDelay());
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
                    <Text style={textStyle}>{this.getText()}</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}
