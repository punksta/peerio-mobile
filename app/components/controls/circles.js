import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';

@observer
export default class Circles extends Component {
    circle(i, current) {
        const style = styles.circle.small;
        const active =
            this.props.fill ? i < current : i === current;
        return <View key={i} style={active ? style.active : style.normal} />;
    }
    render() {
        const circles = [];
        for (let i = 0; i < this.props.count; ++i) {
            circles.push(this.circle(i, this.props.current));
        }
        return (
            <View style={styles.circle.container}>
                {circles}
            </View>
        );
    }
}

Circles.propTypes = {
    count: React.PropTypes.number.isRequired,
    current: React.PropTypes.number.isRequired,
    fill: React.PropTypes.bool
};
