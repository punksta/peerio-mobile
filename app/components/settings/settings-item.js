import React, { Component } from 'react';
import {
    View, TouchableOpacity, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';


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

@observer
export default class SettingsItem extends Component {
    press() {
        // console.log('settings-item.js: press');
        this.props.onPress && this.props.onPress();
    }

    render() {
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                pressRetentionOffset={offset}
                onPress={() => !this.props.disabled && this.press()}>
                <View style={[itemContainerStyle]} pointerEvents="none">
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text style={{ color: this.props.disabled ? vars.txtLight : vars.txtDark }}>
                            {this.props.title}
                        </Text>
                    </View>
                    <View style={{ flex: 0 }}>
                        {icons.dark(this.props.icon || 'keyboard-arrow-right')}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

SettingsItem.propTypes = {
    title: React.PropTypes.any,
    disabled: React.PropTypes.bool,
    icon: React.PropTypes.string,
    onPress: React.PropTypes.any
};

