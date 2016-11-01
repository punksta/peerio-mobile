import React, { Component } from 'react';
import {
    Animated
} from 'react-native';

export default class Swiper extends Component {
    constructor(props) {
        super(props);
        this.state = { x: 0, y: 0 };
        this.drag = { x: 0, y: 0 };
        this.setPosition = this.setPosition.bind(this);
        this.resetPosition = this.resetPosition.bind(this);
        this.layout = this.layout.bind(this);
        this._onStartShouldSetResponder = this._onStartShouldSetResponder.bind(this);
        this._onMoveShouldSetResponder = this._onMoveShouldSetResponder.bind(this);
        this._onMoveShouldSetResponderCapture = this._onMoveShouldSetResponderCapture.bind(this);
    }

    layout(e) {
        this.width = e.nativeEvent.layout.width;
        this.height = e.nativeEvent.layout.width;
    }

    setPosition(e) {
        this.animatedX = null;
        let x = this.state.x;
        let y = this.state.y;
        const tx = e.nativeEvent.pageX - this.drag.x;
        const ty = e.nativeEvent.pageY - this.drag.y;
        if (x === 0) {
            if (this.props.rightToLeft && tx > 0) return;
            if (this.props.leftToRight && tx < 0) return;
        }
        x += tx;
        y += ty;
        this.setState({ x, y });
        this.props.setXY && this.props.setXY({ x, y });
        this.drag.x = e.nativeEvent.pageX;
        this.drag.y = e.nativeEvent.pageY;
        console.log(this.drag);
    }

    resetPosition(/* e */) {
        if (this.state.x !== 0) {
            this.animatedX = new Animated.Value(this.state.x);
            this.props.setAnimated && this.props.setAnimated(this.animatedX);
            let toValue = 0;
            if (this.props.rightToLeft) {
                toValue = this.state.x < -100 ? -this.width : 0;
            }
            if (this.props.leftToRight) {
                toValue = this.state.x > 100 ? this.width : 0;
            }
            Animated.timing(this.animatedX, { toValue, duration: 200 })
                .start(() => {
                    this.animatedX = null;
                    this.props.setAnimated && this.props.setAnimated(this.animatedX);
                    toValue !== 0 && this.props.onHide && this.props.onHide(this);
                });
        }
        this.setState({
            x: 0,
            y: 0
        });
        this.props.setXY && this.props.setXY({ x: 0, y: 0 });
    }

    _onMoveShouldSetResponderCapture(e) {
        return this._onStartShouldSetResponder(e);
    }

    _onStartShouldSetResponder(e) {
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };
        return true;
    }

    _onMoveShouldSetResponder(/* e */) {
        return true;
    }

    getCardStyle() {
    }

    render() {
        const containerStyle = this.props.style || {};
        let t = [];
        const x = { translateX: this.state.x };
        const y = { translateY: this.state.y };
        if (this.props.rightToLeft && this.state.x < 0) {
            t.push(x);
        }
        if (this.props.leftToRight && this.state.x > 0) {
            t.push(x);
        }
        if (this.props.topToBottom && this.state.y > 0) {
            t.push(y);
        }
        if (this.props.bottomToTop && this.state.y < 0) {
            t.push(y);
        }

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
    rightToLeft: React.PropTypes.bool,
    leftToRight: React.PropTypes.bool,
    topToBottom: React.PropTypes.bool,
    bottomToTop: React.PropTypes.bool,
    onHide: React.PropTypes.func,
    setXY: React.PropTypes.func
};
