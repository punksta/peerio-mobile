import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class RecentFilesSectionHeading extends SafeComponent {
    renderThrow() {
        const { title } = this.props;
        if (!title) return null;
        const style = {
            flex: 1,
            flexDirection: 'row',
            height: 48,
            marginTop: 8,
            marginBottom: 16,
            alignItems: 'center',
            backgroundColor: vars.white
        };

        const textStyle = {
            marginLeft: vars.spacing.medium.mini2x,
            fontWeight: 'bold',
            color: vars.txtMedium
        };
        return (
            <View style={style}>
                <Text style={textStyle}>{title}</Text>
            </View>
        );
    }
}

RecentFilesSectionHeading.propTypes = {
    title: PropTypes.any
};
