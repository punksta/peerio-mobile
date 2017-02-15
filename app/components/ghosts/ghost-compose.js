import React, { Component } from 'react';
import {
    View, Text, TextInput
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import GhostSendButton from './ghost-send-button';
import icons from '../helpers/icons';
import ghostState from './ghost-state';
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
    @observable value = value;
    @observable recipient = 'seavan@gmail.com';
    @observable files = [];

    addFiles() {
        fileState.selectFiles()
            .then(files => {
                this.files.clear();
                this.files.push(...files);
            })
            .catch(() => {
                // this.send('user cancelled file selection');
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

    attachments() {
        const map = f => (
            <Text key={f.id}>{f.name}</Text>
        );
        return this.lineBlock(
            <View style={row}>
                {this.text('Attachments:')}
                <View style={filler}>
                    {this.files.map(map)}
                </View>
                {icons.dark('attach-file', () => this.addFiles())}
            </View>
        );
    }

    render() {
        return (
            <View style={[filler]}>
                {this.to()}
                {this.attachments()}
                <TextInput
                    multiline
                    value={this.value}
                    onChangeText={text => (this.value = text)}
                    style={[filler, textArea]} />
                <GhostSendButton />
            </View>
        );
    }
}
