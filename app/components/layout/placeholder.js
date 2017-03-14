import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import SnackBar from '../snackbars/snackbar';

@observer
export default class Placeholder extends Component {
    render() {
        const s = {
            flex: 1,
            justifyContent: 'space-between'
        };
        const ind = <View />;
        const sb = <SnackBar />;
        return (
            <View style={s}>
                {ind}
                {sb}
            </View>
        );
    }
}

