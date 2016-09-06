import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles/styles';

const icons = {
    basic(name, color, onPress, style) {
        return (
            <Icon
                style={style}
                name={name}
                size={24}
                color={color}
                onPress={onPress} />
        );
    },
    white(name, onPress, style) {
        return icons.basic(name, styles.vars.whiteIcon, onPress, style);
    },
    dark(name, onPress, style) {
        return icons.basic(name, styles.vars.darkIcon, onPress, style);
    }
};

export default icons;
