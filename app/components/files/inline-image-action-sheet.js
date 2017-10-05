import React from 'react';
import { observer } from 'mobx-react/native';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';

@observer
export default class InlineImageActionSheet extends SafeComponent {
    RETRY_INDEX = 0;
    DELETE_INDEX = 1;
    CANCEL_INDEX = 2;

    items = [
        { title: tx('button_retry') /* , action: () => this._message.send() */ },
        { title: tx('button_delete') /* , action: () => this._chat.removeMessage(this._message) */ },
        { title: tx('button_cancel') }
    ];

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show() {
        this._actionSheet.show();
    }

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.onPress}
            />
        );
    }
}
