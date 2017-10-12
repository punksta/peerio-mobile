import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class ContactSectionHeader extends SafeComponent {
    renderThrow() {
        const { title } = this.props;
        if (!title) return null;
        const style = {
            height: 48,
            justifyContent: 'center',
            backgroundColor: vars.lightGrayBg
        };

        const textStyle = {
            marginLeft: vars.titleBlockStyle.paddingR,
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

ContactSectionHeader.propTypes = {
    title: PropTypes.any
};
