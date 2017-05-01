import React, { Component } from 'react';
import {
    ScrollView, View, Text, TouchableOpacity, ActivityIndicator
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';

@observer
export default class ChatActionSheet extends Component {
    _message = null;
    _chat = null;

    RETRY_INDEX = 0;
    DELETE_INDEX = 1;
    CANCEL_INDEX = 2;

    retryCancelActionSheet = [
        { title: 'Retry Send', action: () => this._message.send() },
        { title: 'Delete Message', action: () => this._chat.removeMessage(this._message) },
        { title: 'Cancel' }
    ];

    retryCancelPress = index => {
        const { action } = this.retryCancelActionSheet[index];
        action && action();
    };

    show(message, chat) {
        this._message = message;
        this._chat = chat;
        this._actionSheet.show();
    }

    render() {
        return (
            <ActionSheet
                ref={sheet => (this._actionSheet = sheet)}
                options={this.retryCancelActionSheet.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.retryCancelPress}
            />
        );
    }
}
