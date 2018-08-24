import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, StatusBar } from 'react-native';
import SafeComponent from '../shared/safe-component';
import SnackBarConnection from '../snackbars/snackbar-connection';

@observer
export default class LayoutSignup extends SafeComponent {
    constructor(props) {
        super(props);
        this.layout = this.layout.bind(this);
        this.scroll = this.scroll.bind(this);
    }

    layout(e) {
        this.scrollViewHeight = e.nativeEvent.layout.height;
    }

    scroll(e) {
        this.scrollViewTop = e.nativeEvent.contentOffset.y;
    }

    renderThrow() {
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                alwaysBounceVertical={false}
                style={{ flexGrow: 1 }}>
                {this.props.body}
                {this.props.footer}
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <SnackBarConnection />
                </View>
                <StatusBar hidden key="statusBar" />
            </ScrollView>
        );
    }
}
