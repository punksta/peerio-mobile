import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from '../layout/popup-layout';
import { vars } from '../../styles/styles';
import { popupInputCancel } from '../shared/popups';

@observer
export default class MockChatList extends Component {
    componentDidMount() {
        popupInputCancel(
            'Create a folder', 'Enter a folder name', null, null, true);
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
