import React, { Component } from 'react';
import {
    View, ActivityIndicator
} from 'react-native';
import { observer } from 'mobx-react/native';
import SnackBar from '../snackbars/snackbar';
import mainState from '../main/main-state';

@observer
export default class Placeholder extends Component {
    render() {
        const s = {
            flex: 1,
            justifyContent: 'space-between'
        };
        const ind = mainState.loading ?
            <ActivityIndicator style={{ paddingTop: 10 }} /> : <View />;
        const sb = mainState.loading ? null : <SnackBar />;
        return (
            <View style={s}>
                {ind}
                {sb}
            </View>
        );
    }
}

