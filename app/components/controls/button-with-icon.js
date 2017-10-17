import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { vars, button } from '../../styles/styles';

const defaultTextStyle = {
    backgroundColor: 'transparent',
    paddingTop: 2
};

const containerStyle = {
    flexDirection: 'row',
    justifyContent: 'center'
};

export default class ButtonWithIcon extends Component {
    render() {
        const style = button;
        let textStyle = this.props.bold ?
            style.text.bold : style.text.normal;
        const opacity = { opacity: this.props.disabled ? 0.5 : 1 };
        if (this.props.textStyle) {
            textStyle = [textStyle, this.props.textStyle];
        }

        const text = this.props.text || '';
        const press = () => {
            !this.props.disabled && this.props.onPress && this.props.onPress();
            return true;
        };
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                pressRetentionOffset={offset}
                onPress={press}
                accessible={this.props.accessible}
                accessibilityLabel={this.props.accessibilityLabel}
                testID={this.props.testID}>
                <View style={[this.props.style, containerStyle]}>
                    <Icon
                        style={{ paddingHorizontal: 7 }}
                        name={this.props.iconName}
                        size={vars.iconSize}
                        color="gray"
                        />
                    <Text style={[defaultTextStyle, textStyle, opacity]}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

ButtonWithIcon.propTypes = {
    style: PropTypes.any,
    textStyle: PropTypes.any,
    onPress: PropTypes.any,
    text: PropTypes.any.isRequired,
    caps: PropTypes.bool,
    disabled: PropTypes.bool,
    testID: PropTypes.string,
    bold: PropTypes.bool,
    iconName: PropTypes.string,
    accessible: PropTypes.bool,
    accessibilityLabel: PropTypes.string
};
