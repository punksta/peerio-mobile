import React from 'react';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';

const outerCircle = {
    borderColor: '#7a7a7a',
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
};

const innerCircle = {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#4083d2'
};

export default class Circle extends SafeComponent {
    render() {
        const { isSelected } = this.props;

        return (
            <View style={{ padding: 10 }}>
                <View style={outerCircle}>
                    {isSelected ? <View style={innerCircle} /> : null}
                </View>
            </View>
        );
    }
}

Circle.propTypes = {
    isSelected: React.PropTypes.bool
};

Circle.defaultProps = {
    isSelected: true
};
