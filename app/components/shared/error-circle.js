import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';

const diameter = 18;

@observer
export default class ErrorCircle extends Component {
    render() {
        const ratio = this.props.large ? 2 : 1;
        const width = diameter * ratio;
        const height = width;
        const tofuStyle = {
            position: 'absolute',
            right: 0,
            width,
            height,
            borderRadius: width / 2,
            borderColor: 'white',
            borderWidth: 1,
            backgroundColor: 'red',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 4,
            marginTop: 10
        };

        return (
            <View style={tofuStyle}>
                <Text style={{ color: 'white', fontSize: 12 * ratio, fontWeight: 'bold' }}>!</Text>
            </View>
        );
    }
}

ErrorCircle.propTypes = {
    large: React.PropTypes.bool
};

