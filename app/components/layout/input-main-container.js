import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import InputMain from './input-main';
import chatState from '../messaging/chat-state';
import FileInlineProgress from '../files/file-inline-progress';
import FilesActionSheet from '../files/files-action-sheet';
import { vars } from '../../styles/styles';

@observer
export default class InputMainContainer extends SafeComponent {
    send = (v) => {
        const message = v;
        if (!message || !message.length) {
            this.sendAck();
            return;
        }
        chatState.addMessage(message);
    };

    sendAck = () => chatState.addAck();

    plus = () => this.filesActionSheet.show();

    uploadQueue() {
        const chat = chatState.currentChat;
        const q = chat && chat.uploadQueue || [];
        return q.map(f => (
            <View style={{ margin: vars.spacing.small.maxi2x }} key={f.fileId}>
                <FileInlineProgress file={f.fileId} transparentOnFinishUpload />
            </View>
        ));
    }

    renderThrow() {
        const outer = {
            backgroundColor: vars.white
        };
        const s = {
            borderTopColor: vars.lightGrayBg,
            borderTopWidth: 1
        };
        return (
            <View style={outer}>
                <View>
                    {this.uploadQueue()}
                </View>
                <View style={s}>
                    <InputMain
                        {...this.props}
                        plus={this.plus}
                        sendAck={this.sendAck}
                        send={this.send} />
                </View>
                <FilesActionSheet inline ref={ref => { this.filesActionSheet = ref; }} />
            </View>
        );
    }
}
