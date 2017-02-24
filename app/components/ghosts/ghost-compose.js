import React, { Component } from 'react';
import {
    View, Text, TextInput
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import GhostSendButton from './ghost-send-button';
import icons from '../helpers/icons';
import ProgressOverlay from '../shared/progress-overlay';
import ghostState from './ghost-state';
import { mailStore } from '../../lib/icebear';
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
    fontSize: 16,
    color: vars.txtDark
};

const textArea = {
    fontSize: 14,
    marginHorizontal: 10,
    color: vars.txtDark
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

@observer
export default class ComposeMessage extends Component {
    get ghost() {
        return mailStore.selectedGhost;
    }

    get isValid() {
        return !!((this.files.length || this.value.length) && this.recipient.length);
    }

    @observable value = __DEV__ ? value : '';
    @observable recipient = __DEV__ ? 'seavan@gmail.com' : '';
    @observable files = [];
    @observable subject = __DEV__ ? 'test subject' : '';
    @observable inProgress = false;

    send() {
        const g = mailStore.createGhost();
        g.attachFiles(this.files);
        g.recipients.push(this.recipient);
        g.subject = this.subject;
        this.inProgress = true;
        setTimeout(() => {
            g.send(this.value)
                .then(() => {
                    ghostState.view(g);
                    console.log(`ghost-compose.js: sent ${g.ghostId}`);
                })
                .catch(e => {
                    console.error(`ghost-compose.js: sending error`);
                    console.log(e);
                    g.remove();
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

    text(t) {
        return (
            <Text style={{ color: vars.subtleText, padding: 8 }}>
                {t}
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

    to() {
        return this.lineBlock(
            <View style={row}>
                {this.text('To:')}
                <TextInput
                    keyboardType="email-address"
                    underlineColorAndroid={'transparent'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={false}
                    value={this.recipient}
                    onChangeText={text => (this.recipient = text)}
                    style={textboxInput} />
                {icons.dark('keyboard-arrow-down')}
            </View>
        );
    }

    subjectBlock() {
        return this.lineBlock(
            <View style={row}>
                {this.text('Subject:')}
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

    render() {
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

