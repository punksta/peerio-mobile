import React, { Component } from 'react';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import InputMain from './input-main';
import chatState from '../messaging/chat-state';
import fileState from '../files/file-state';
import imagePicker from '../helpers/imagepicker';
import FileInlineProgress from '../files/file-inline-progress';

export default class InputMainContainer extends SafeComponent {
    constructor(props) {
        super(props);
        this.send = this.send.bind(this);
        this.sendAck = this.sendAck.bind(this);
        this.addFiles = this.addFiles.bind(this);
    }

    // setFocus() {
    //     this.input && this.input.setFocus();
    // }

    send(v) {
        const message = v;
        if (!message || !message.length) {
            this.sendAck();
            return;
        }
        chatState.addMessage(message);
    }

    sendAck() {
        chatState.addAck();
    }

    addFiles() {
        const buttons = [
            { name: 'share', title: tx('title_shareFromFiles') }
        ];
        imagePicker.show(
            buttons,
            fileState.uploadInline,
            () => {
                fileState.selectFiles()
                    .then(files => {
                        if (files.length) {
                            chatState.addMessage('', files);
                        }
                    })
                    .catch(() => {});
            }
        );
    }

    uploadQueue() {
        const chat = chatState.currentChat;
        const q = chat ? chat.uploadQueue : [];
        return q.map(f => (
            <View style={{ margin: 12 }}>
                <FileInlineProgress key={f.fileId} file={f.fileId} transparentOnFinishUpload />
            </View>
        ));
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
                        plus={this.addFiles}
                        sendAck={this.sendAck}
                        send={this.send} />
                </View>
            </View>
        );
    }
}
