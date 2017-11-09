import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import InputMain from './input-main';
import chatState from '../messaging/chat-state';
import FileInlineProgress from '../files/file-inline-progress';
import FileProgress from '../files/file-progress';
import FilesActionSheet from '../files/files-action-sheet';

@observer
export default class InputMainContainer extends SafeComponent {
    send = (v) => {
        const message = v;
        if (!message || !message.length) {
            this.sendAck();
            return;
        }
        chatState.addMessage(message);
    }

    sendAck = () => chatState.addAck();

    plus = () => this.filesActionSheet.show();

    uploadQueue() {
        const chat = chatState.currentChat;
        const q = chat && chat.uploadQueue || [];
        return q.map(f => <FileProgress key={f.fileId} file={f} />);
    }

    renderThrow() {
        const outer = {
            backgroundColor: '#fff'
        };
        const s = {
            minHeight: 80,
            borderTopColor: 'rgba(0, 0, 0, .12)',
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
