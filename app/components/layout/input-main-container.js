import React, { Component } from 'react';
import {
    View
} from 'react-native';
import InputMain from './input-main';
import mainState from '../main/main-state';
import fileState from '../files/file-state';
import imagePicker from '../helpers/imagepicker';

export default class InputMainContainer extends Component {
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
        mainState.addMessage(message);
    }

    sendAck() {
        mainState.addAck();
    }

    addFiles() {
        const buttons = [
            { name: 'share', title: 'Share from Peerio' }
        ];
        imagePicker.show(
            buttons,
            fileState.uploadInline,
            () => {
                fileState.selectFiles()
                    .then(files => {
                        if (files.length) {
                            mainState.addMessage('', files);
                        }
                    })
                    .catch(() => {});
            }
        );
    }

    render() {
        const s = {
            minHeight: 80,
            borderTopColor: 'rgba(0, 0, 0, .12)',
            borderTopWidth: 1,
            backgroundColor: '#fff'
        };
        return (
            <View style={s}>
                <InputMain
                    plus={this.addFiles}
                    sendAck={this.sendAck}
                    send={this.send} />
            </View>
        );
    }
}
