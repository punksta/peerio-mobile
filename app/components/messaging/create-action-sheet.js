import React from 'react';
import { observer } from 'mobx-react/native';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import routes from '../routes/routes';

@observer
export default class CreateActionSheet extends SafeComponent {
    _message = null;
    _chat = null;

    CANCEL_INDEX = 2;

    actionSheetItems = [
        { title: tx('title_newRoom'), action: () => routes.modal.createChannel() },
        { title: tx('title_newDirectMessage'), action: () => routes.modal.compose() },
        { title: tx('button_cancel') }
    ];

    retryCancelPress = index => {
        const { action } = this.actionSheetItems[index];
        action && action();
    };

    show() {
        this._actionSheet.show();
    }

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.actionSheetItems.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                onPress={this.retryCancelPress}
            />
        );
    }
}
