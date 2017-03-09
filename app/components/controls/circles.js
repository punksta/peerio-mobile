import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';

const s = {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 10,
    marginBottom: 32
};

const style = styles.circle.small;

const dash = {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent'
};

const dashText = {
    color: 'white',
    fontSize: 18
};

@observer
export default class Circles extends Component {
    active(i) {
        return (
            <View key={i} style={style.active} />
        );
    }

    normal(i) {
        return this.props.empty ? (
            <View key={i} style={style.normal} />
        ) : (
            <View key={i} style={[style.active, dash]}>
                <Text style={dashText}>-</Text>
            </View>
        );
    }

    circle(i, current) {
        const active =
            this.props.fill ? i < current : i === current;
        return active ? this.active(i) : this.normal(i);
    }

    render() {
        const circles = [];
        for (let i = 0; i < this.props.count; ++i) {
            circles.push(this.circle(i, this.props.current));
        }
        return (
            <View style={s}>
                {circles}
            </View>
        );
    }
}

Circles.propTypes = {
    count: React.PropTypes.number.isRequired,
    current: React.PropTypes.number.isRequired,
    fill: React.PropTypes.bool,
    empty: React.PropTypes.bool
};
