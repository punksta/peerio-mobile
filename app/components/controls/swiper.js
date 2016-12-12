import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { reaction } from 'mobx';

export default class Swiper extends Component {
    constructor(props) {
        super(props);
        this.x = 0;
        this.drag = { x: 0, y: 0 };
        this.setPosition = this.setPosition.bind(this);
        this.resetPosition = this.resetPosition.bind(this);
        this.layout = this.layout.bind(this);
        this._onStartShouldSetResponder = this._onStartShouldSetResponder.bind(this);
        this._onMoveShouldSetResponderCapture = this._onMoveShouldSetResponderCapture.bind(this);
        this.state = props.state;
        this.width = props.width;
        this.animatedX = new Animated.Value(this.visible ? 0 : this.shift);
        reaction(() => this.visible, () => {
            this.visible ? this.show() : this.hide();
        }, true);
    }

    get visible() {
        return this.props.visible && this.state && this.state[this.props.visible];
    }

    get shift() {
        // 100 is to prevent strange bug with not hiding the swiper completely off screen
        const w = this.props.shift || (this.width + 100);
        return (this.props.rightToLeft ? -1 : 1) * w;
    }

    layout(e) {
        this.width = e.nativeEvent.layout.width;
        this.height = e.nativeEvent.layout.width;
    }

    animate(toValue, fast, cb) {
        Animated.timing(this.animatedX, {
            toValue, duration: fast ? 0 : 200, easing: Easing.bezier(0.4, 0.0, 1, 1) }).start(cb);
    }

    show() {
        this.animate(0);
    }

    hide() {
        this.animate(this.shift);
    }

    setVisible(value) {
        this.state && (this.state[this.props.visible] = value);
    }

    setPosition(e) {
        let x = this.x;
        let y = this.y;
        const tx = e.nativeEvent.pageX - this.drag.x;
        const ty = e.nativeEvent.pageY - this.drag.y;
        x += tx;
        y += ty;
        if ((this.props.rightToLeft && x > 0) || (this.props.leftToRight && x < 0)) {
            return;
            // x = 0;
        }
        if (this.props.leftToRight && x > this.shift) {
            x = this.shift;
        }

        this.animate(x, true);
        this.x = x;
        this.y = y;
        this.drag.x = e.nativeEvent.pageX;
        this.drag.y = e.nativeEvent.pageY;
        // console.log(this.drag);
    }

    resetPosition(/* e */) {
        const x = Math.abs(this.x);
        const shift = Math.abs(this.shift) * (this.props.threshold || 0.1);
        if (x > shift) {
            this.hide();
            this.setVisible(false);
            this.props.onSwipeOut && this.props.onSwipeOut();
        } else {
            this.show();
            this.setVisible(true);
            this.props.onSwipeReset && this.props.onSwipeReset();
        }
        this.x = 0;
        this.y = 0;
        this.drag = { x: 0, y: 0 };
    }

    _onMoveShouldSetResponderCapture(e) {
        if (!this.visible) {
            return false;
        }
        // console.log('swiper.js: getting capture offer');
        const { x, y } = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
        const dx = Math.abs(x - this.drag.x);
        const dy = Math.abs(y - this.drag.y);
        if (dx > dy && dx > 50) {
            this.drag = { x, y };
            return true;
        }
        this.resetPosition();
        return false;
        // return this._onStartShouldSetResponder(e);
    }

    _onStartShouldSetResponder(e) {
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };
        this.setPosition(e);
        return true;
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
                onResponderTerminate={this.resetPosition}
                onMoveShouldSetResponderCapture={this._onMoveShouldSetResponderCapture}
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
    leftToRight: React.PropTypes.bool,
    width: React.PropTypes.any,
    shift: React.PropTypes.any,
    threshold: React.PropTypes.any,
    onSwipeOut: React.PropTypes.func,
    onSwipeReset: React.PropTypes.func
};
