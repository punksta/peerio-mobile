import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles/styles';

const icons = {
    basic(name, color, onPress, style) {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ padding: styles.vars.iconPadding }}>
                    <Icon
                        style={style}
                        name={name}
                        size={styles.vars.iconSize}
                        color={color} />
                </View>
            </TouchableOpacity>
        );
    },

    plaindark(name) {
        return (
            <Icon
                name={name}
                size={styles.vars.iconSize}
                color={styles.vars.darkIcon} />
        );
    },

    white(name, onPress, style) {
        return icons.basic(name, styles.vars.whiteIcon, onPress, style);
    },

    dark(name, onPress, style) {
        return icons.basic(name, styles.vars.darkIcon, onPress, style);
    },

    colored(name, onPress, colorFg, backgroundColor) {
        return icons.basic(name, colorFg, onPress, { backgroundColor });
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
    },

    text(text, onPress, style) {
        const size = styles.vars.iconPadding * 2 + styles.vars.iconSize;
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ height: size, width: size, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={style}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
};

export default icons;
