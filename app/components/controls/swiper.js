import React, { Component } from 'react';
import {
    Animated
} from 'react-native';
import { reaction } from 'mobx';

export default class Swiper extends Component {
    constructor(props) {
        super(props);
        this.x = 0;
        this.y = 0;
        this.drag = { x: 0, y: 0 };
        this.setPosition = this.setPosition.bind(this);
        this.resetPosition = this.resetPosition.bind(this);
        this.layout = this.layout.bind(this);
        this.animatedX = new Animated.Value(this.x);
        this._onStartShouldSetResponder = this._onStartShouldSetResponder.bind(this);
        this._onMoveShouldSetResponder = this._onMoveShouldSetResponder.bind(this);
        this._onMoveShouldSetResponderCapture = this._onMoveShouldSetResponderCapture.bind(this);
        this.state = props.state;
        if (props.visible) {
            reaction(() => this.state[props.visible], () => {
                this.state[props.visible] ? this.show() : this.hide();
            }, true);
        }
    }

    layout(e) {
        this.width = e.nativeEvent.layout.width;
        this.height = e.nativeEvent.layout.width;
    }

    animate(toValue, fast, cb) {
        Animated.timing(this.animatedX, { toValue, duration: fast ? 0 : 200 }).start(cb);
    }

    show() {
        this.animate(0);
    }

    hide() {
        this.animate(this.props.rightToLeft ? -this.width : this.width);
    }

    setPosition(e) {
        let x = this.x;
        let y = this.y;
        const tx = e.nativeEvent.pageX - this.drag.x;
        const ty = e.nativeEvent.pageY - this.drag.y;
        if (x === 0) {
            if (this.props.rightToLeft && tx > 0) return;
            if (this.props.leftToRight && tx < 0) return;
        }
        x += tx;
        y += ty;
        this.animate(x, true);
        this.x = x;
        this.y = y;
        this.drag.x = e.nativeEvent.pageX;
        this.drag.y = e.nativeEvent.pageY;
        // console.log(this.drag);
    }

    resetPosition(/* e */) {
        if (this.x !== 0) {
            this.animatedX.setValue(this.x);
            let toValue = 0;
            if (this.props.rightToLeft) {
                toValue = this.x < -100 ? -this.width : 0;
            }
            if (this.props.leftToRight) {
                toValue = this.x > 100 ? this.width : 0;
            }
            toValue !== 0 && (this.state[this.props.visible] = false);
            this.animate(toValue);
        }
        this.x = 0;
        this.y = 0;
    }

    _onMoveShouldSetResponderCapture(e) {
        // console.log('swiper.js: getting capture offer');
        const { x, y } = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
        const dx = Math.abs(x - this.drag.x);
        const dy = Math.abs(y - this.drag.y);
        if (dx > dy || dx > 100) {
            this.drag = { x, y };
            return true;
        }
        return false;
        // return this._onStartShouldSetResponder(e);
    }

    _onStartShouldSetResponder(e) {
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };
        // console.log('swiper.js: captured grag');
        return true;
    }

    _onMoveShouldSetResponder(/* e */) {
        return false;
    }

    getCardStyle() {
    }

    render() {
        const containerStyle = this.props.style || {};
        let t = [];
        if (this.animatedX) {
            t = [{ translateX: this.animatedX }];
        }
        const s = { transform: t };

        return (
            <Animated.View
                onLayout={this.layout}
                onResponderMove={this.setPosition}
                onResponderRelease={this.resetPosition}
                onStartShouldSetResponder={this._onStartShouldSetResponder}
                onMoveShouldSetResponderCapture={this._onMoveShouldSetResponderCapture}
                onMoveShouldSetResponder={this._onMoveShouldSetResponder}
                style={[containerStyle, s]}>
                { this.props.children }
            </Animated.View>
        );
    }
}

Swiper.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any,
    state: React.PropTypes.any,
    visible: React.PropTypes.string.isRequired,
    rightToLeft: React.PropTypes.bool,
    leftToRight: React.PropTypes.bool
    // topToBottom: React.PropTypes.bool,
    // bottomToTop: React.PropTypes.bool,
};
