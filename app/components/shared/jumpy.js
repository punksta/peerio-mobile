import React, { Component } from 'react';
import {
    View,
    Animated
} from 'react-native';

export default class Jumpy extends Component {
    animated = new Animated.Value(0);

    componentDidMount() {
        this.animate = () => {
            const radius = this.props.radius || 10;
            this.dirY = !this.dirY;
            const toValue = this.dirY ? -radius : radius;
            const duration = 1000;
            Animated.timing(this.animated, { toValue, duration }).start(this.animate);
        };
        this.animate();
    }

    componentWillUnmount() {
        this.animate = null;
    }

    render() {
        const container = {
            overflow: 'hidden'
        };

        const s = {
            transform: [
                { translateY: this.animated }
            ]
        };

        return (
            <View style={container}>
                <Animated.View style={s}>
                    {this.props.children}
                </Animated.View>
            </View>
        );
    }
}

Jumpy.propTypes = {
    children: React.PropTypes.any,
    radius: React.PropTypes.number
};

