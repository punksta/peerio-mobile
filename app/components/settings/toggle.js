import React, { Component } from 'react';
import { View, LayoutAnimation, TouchableOpacity } from 'react-native';
import { reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { vars, helpers } from '../../styles/styles';

const inactiveColor = '#9B9B9B';
const activeColor = vars.bg;

@observer
export default class Toggle extends Component {
    componentDidMount() {
        reaction(() => this.props.active, () => LayoutAnimation.easeInEaseOut());
    }

    render() {
        const { active } = this.props;

        const outer = {
            marginHorizontal: 16,
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
        };
        const under = {
            borderRadius: 2,
            width: 36,
            height: 4,
            backgroundColor: active ? vars.txtLight : '#CFCFCF'
        };

        const circle = helpers.circle(24);
        const circleOuter = {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: active ? 'flex-end' : 'flex-start'
        };
        const circleAll = {
            backgroundColor: active ? activeColor : inactiveColor
        };

        return (
            <TouchableOpacity style={outer} pressRetentionOffset={vars.retentionOffset} onPress={this.props.onPress}>
                <View style={under} />
                <View style={circleOuter}>
                    <View style={[circle, circleAll]} />
                </View>
            </TouchableOpacity>
        );
    }
}

Toggle.propTypes = {
    active: React.PropTypes.bool,
    onPress: React.PropTypes.any
};

