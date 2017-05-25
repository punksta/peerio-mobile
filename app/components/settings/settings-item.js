import React, { Component } from 'react';
import {
    View, TouchableOpacity, Text
} from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { t } from '../utils/translator';

const itemContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: vars.iconSize,
    marginBottom: 2,
    borderWidth: 0,
    borderColor: 'green'
};

export default class SettingsItem extends SafeComponent {
    press() {
        // console.log('settings-item.js: press');
        this.props.onPress && this.props.onPress();
    }

    get rightIcon() {
        return this.props.icon !== null ?
            icons.dark(this.props.icon || 'keyboard-arrow-right')
            : null;
    }

    renderThrow() {
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                activeOpacity={this.props.untappable ? 1 : 0.3}
                pressRetentionOffset={offset}
                testID={this.props.title}
                onPress={() => !this.props.untappable && !this.props.disabled && this.press()}>
                <View style={[itemContainerStyle]} pointerEvents={this.props.untappable ? undefined : 'none'}>
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text style={{ color: this.props.disabled ? vars.txtLight : vars.txtDark }}>
                            {t(this.props.title)}
                        </Text>
                    </View>
                    <View style={{ flex: 0 }}>
                        {this.props.children}
                    </View>
                    <View style={{ flex: 0, minHeight: vars.iconLayoutSize }}>
                        {this.rightIcon}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

SettingsItem.propTypes = {
    children: React.PropTypes.any,
    title: React.PropTypes.any,
    disabled: React.PropTypes.bool,
    untappable: React.PropTypes.bool,
    icon: React.PropTypes.string,
    onPress: React.PropTypes.any
};

