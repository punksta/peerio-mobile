import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import SnackBar from '../snackbars/snackbar';
import styles from '../../styles/styles';
import icons from '../helpers/icons';

const itemStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
};

const itemContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)',
    backgroundColor: 'white',
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
                        <View style={{ flex: 1 }}>
                            <Text>file name something</Text>
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
