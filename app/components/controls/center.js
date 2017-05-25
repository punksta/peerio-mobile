import React, { Component } from 'react';
import {
    View
} from 'react-native';

export default class Center extends Component {
    render() {
        const style = {
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
            <View style={[style, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

Center.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};
