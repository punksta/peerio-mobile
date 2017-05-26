import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import SnackBar from '../snackbars/snackbar';

@observer
export default class Placeholder extends SafeComponent {
    renderThrow() {
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

