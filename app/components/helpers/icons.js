import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles/styles';

const icons = {
    basic(name, color, onPress, style) {
        return (
            <TouchableOpacity onPress={onPress}>
                <Icon
                    style={[{ padding: styles.vars.iconPadding }, style]}
                    name={name}
                    size={styles.vars.iconSize}
                    color={color} />
            </TouchableOpacity>
        );
    },

    white(name, onPress, style) {
        return icons.basic(name, styles.vars.whiteIcon, onPress, style);
    },

    dark(name, onPress, style) {
        return icons.basic(name, styles.vars.darkIcon, onPress, style);
    },

    placeholder() {
        const d = styles.vars.iconSize + styles.vars.iconPadding * 2;
        const s = {
            height: d,
            width: d
        };
        return (
            <View style={s} />
        );
    }
};

export default icons;
