import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import styles from '../../styles/styles';
import icons from '../helpers/icons';

const itemContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)',
    backgroundColor: 'white',
    height: 64,
    paddingLeft: 8
};

export default class FileItem extends Component {
    render() {
        const iconLeft = icons.dark('image');
        const iconRight = icons.dark('keyboard-arrow-right');
        return (
            <View style={{ backgroundColor: styles.vars.bg }}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <View style={itemContainerStyle} pointerEvents="none">
                        {iconLeft}
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={{
                                color: styles.vars.txtDark,
                                fontSize: 14,
                                fontWeight: styles.vars.font.weight.bold
                            }}>file name something</Text>
                            <Text style={{
                                color: styles.vars.subtleText,
                                fontSize: 12,
                                fontWeight: styles.vars.font.weight.regular
                            }}>Date - owner</Text>
                        </View>
                        {iconRight}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

FileItem.propTypes = {
    onPress: React.PropTypes.func
};
