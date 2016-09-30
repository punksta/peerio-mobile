import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles/styles';

const icons = {
    basic(name, color, onPress, style) {
        return (
            <TouchableOpacity onPress={onPress}>
                <Icon
                    style={style}
                    name={name}
                    size={24}
                    color={color} />
            </TouchableOpacity>
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
