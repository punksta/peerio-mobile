import React, { Component } from 'react';
import {
    View, Text, TextInput, TouchableOpacity
} from 'react-native';
import { observable } from 'mobx';
import { popupUpgrade } from '../shared/popups';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import GhostSendButton from './ghost-send-button';
import icons from '../helpers/icons';
import ProgressOverlay from '../shared/progress-overlay';
import ghostState from './ghost-state';
import { mailStore, errors } from '../../lib/icebear';
import fileState from '../files/file-state';
import { vars } from '../../styles/styles';

const row = {
    flexDirection: 'row',
    alignItems: 'center'
};

const filler = {
    flex: 1,
    flexGrow: 1
};

const textboxInput = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 16,
    color: vars.txtDark,
    marginLeft: 8
};

const textArea = {
    fontSize: 14,
    marginHorizontal: 10,
    color: vars.txtDark,
    height: vars.inputHeight
};

const shadow = {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
        height: 1,
        width: 1
    }
};

const recipient = {
    flex: 0,
    height: vars.inputHeight
};

const value = `
If true, the text field will blur when submitted.
The default value is true for single-line fields
and false for multiline fields. Note that for
multiline fields, setting blurOnSubmit to true means
that pressing return will blur the field and trigger
the onSubmitEditing event instead of inserting a
newline into the field.

If true, the text field will blur when submitted.
The default value is true for single-line fields
and false for multiline fields. Note that for
multiline fields, setting blurOnSubmit to true means
that pressing return will blur the field and trigger
the onSubmitEditing event instead of inserting a
newline into the field.

If true, the text field will blur when submitted.
The default value is true for single-line fields
and false for multiline fields. Note that for
multiline fields, setting blurOnSubmit to true means
that pressing return will blur the field and trigger
the onSubmitEditing event instead of inserting a
newline into the field.

If true, the text field will blur when submitted.
The default value is true for single-line fields
and false for multiline fields. Note that for
multiline fields, setting blurOnSubmit to true means
that pressing return will blur the field and trigger
the onSubmitEditing event instead of inserting a
newline into the field.
`;

export default class ComposeMessage extends SafeComponent {
    @observable recipients = __DEV__ ?
        ['seav@gmail.com', 'testvsov@bl.com', 'romeiro@romeiro.com'] : [];
    @observable typingRecipient = __DEV__ ? 'seavan@gmail.com' : '';

    get ghost() {
        return mailStore.selectedGhost;
    }

    get isValid() {
        return !!((this.files.length || this.value.length) && this.recipients.length);
    }

    @observable value = __DEV__ ? value : '';
    @observable files = [];
    @observable subject = __DEV__ ? 'test subject' : '';
    @observable inProgress = false;

    send() {
        const g = mailStore.createGhost();
        g.attachFiles(this.files);
        g.recipients = this.recipients.slice();
        g.subject = this.subject;
        this.inProgress = true;
        setTimeout(() => {
            mailStore.send(g, this.value)
                .then(() => {
                    ghostState.view(g);
                    console.log(`ghost-compose.js: sent ${g.ghostId}`);
                })
                .finally(() => (this.inProgress = false));
        }, 100);
    }

    addFiles() {
        fileState.selectFiles()
            .then(files => {
                this.files.clear();
                this.files.push(...files);
            })
            .catch(() => {
                console.log('ghost-compose.js: user cancelled file selection');
            });
    }

    textWithColon(text) {
        return (
            <Text style={{ color: vars.subtleText, padding: 8 }}>
                {text}:
            </Text>
        );
    }

    lineBlock(content) {
        const s = {
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    recipient(r) {
        const bubble = {
            backgroundColor: vars.bg,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            margin: 4,
            paddingHorizontal: 8,
            flexGrow: 1,
            flexShrink: 1,
            flexDirection: 'row'
        };
        const text = {
            color: vars.white
        };
        return (
            <TouchableOpacity onPress={() => this.removeRecipient(r)} key={r}>
                <View style={recipient}>
                    <View style={bubble}>
                        <Text
                            ellipsizeMode="tail"
                            style={text}>{r}</Text>
                        {icons.plainWhite('close')}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    recipientsBox() {
        return this.recipients.map(r => this.recipient(r));
    }

    pushRecipient(r) {
        const i = this.recipients.indexOf(r);
        (i === -1) && this.recipients.push(r);
    }

    removeRecipient(r) {
        const i = this.recipients.indexOf(r);
        (i !== -1) && this.recipients.splice(i, 1);
    }

    to() {
        const changeText = (text) => {
            const items = text.split(/[ ,]/).map(s => s.trim()).filter(s => !!s);
            if (items.length > 1) {
                this.pushRecipient(items[0]);
                this.typingRecipient = items[1];
                return;
            }
            this.typingRecipient = text;
        };

        const pushRemaining = () => {
            const r = this.typingRecipient.trim();
            !!r && this.pushRecipient(r);
            this.typingRecipient = '';
        };

        const container = {
            flexGrow: 1,
            flexShrink: 1,
            borderWidth: 1,
            borderColor: 'transparent',
            flexWrap: 'wrap'
        };

        return this.lineBlock(
            <View style={row}>
                {this.textWithColon(tx('title_to'))}
                <View style={{ flexGrow: 1 }}>
                    <View style={[row, container]}>
                        {this.recipientsBox()}
                        <View style={[recipient, { flexGrow: 1 }]}>
                            <TextInput
                                keyboardType="email-address"
                                underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete={false}
                                value={this.typingRecipient}
                                onBlur={() => pushRemaining()}
                                onChangeText={text => changeText(text)}
                                style={textboxInput} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    subjectBlock() {
        return this.lineBlock(
            <View style={row}>
                {this.textWithColon(tx('title_subject'))}
                <TextInput
                    underlineColorAndroid={'transparent'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={false}
                    value={this.subject}
                    onChangeText={text => (this.subject = text)}
                    style={textboxInput} />
                {icons.dark('attach-file', () => this.addFiles())}
            </View>
        );
    }

    attachment(f) {
        const container = {
            flex: 0,
            backgroundColor: vars.bg,
            borderRadius: 4,
            padding: 4,
            margin: 4
        };
        const text = {
            color: 'white'
        };
        return (
            <View key={f.id} style={container}>
                <Text style={text}>{f.name}</Text>
            </View>
        );
    }

    attachments() {
        if (this.files.length === 0) return null;
        return this.lineBlock(
            <View style={row}>
                {this.files.map(f => this.attachment(f))}
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={[filler]}>
                <View style={shadow}>
                    {this.to()}
                    {this.subjectBlock()}
                    {this.attachments()}
                </View>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    multiline
                    value={this.value}
                    onChangeText={text => (this.value = text)}
                    style={[filler, textArea]} />
                <GhostSendButton enabled={this.isValid} send={() => this.send()} />
                <ProgressOverlay enabled={this.inProgress} />
            </View>
        );
    }
}
