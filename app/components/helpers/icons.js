import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { vars } from '../../styles/styles';

const icons = {
    basic(name, color, onPress, style, size) {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ padding: vars.iconPadding }}>
                    <Icon
                        style={style}
                        name={name}
                        size={size || vars.iconSize}
                        color={color} />
                </View>
            </TouchableOpacity>
        );
    },

    plaindark(name) {
        return (
            <Icon
                name={name}
                size={vars.iconSize}
                color={vars.darkIcon} />
        );
    },

    white(name, onPress, style, size) {
        return icons.basic(name, vars.whiteIcon, onPress, style, size);
    },

    dark(name, onPress, style, size) {
        return icons.basic(name, vars.darkIcon, onPress, style, size);
    },

    colored(name, onPress, colorFg, backgroundColor) {
        return icons.basic(name, colorFg, onPress, { backgroundColor });
    },

    placeholder() {
        const d = vars.iconSize + vars.iconPadding * 2;
        const s = {
            height: d,
            width: d
        };
        return (
            <View style={s} />
        );
    },

    text(text, onPress, style) {
        const size = vars.iconPadding * 2 + vars.iconSize;
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
