import React, { Component } from 'react';
import {
    View, Text, TextInput
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';
import Layout1 from '../layout/layout1';
import Center from '../controls/center';
import Avatar from '../shared/avatar';
import icons from '../helpers/icons';
import styles from '../../styles/styles';
import InputMain from '../layout/input-main';
import messagingState from './messaging-state';
import { chatStore, Contact, contactStore } from '../../lib/icebear';

@observer
export default class ComposeMessage extends Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount() {
        // setTimeout(() => this.textInput.focus(), 100);
    }

    exit() {
        messagingState.exit();
    }

    userbox(contact, i) {
        const style = {
            backgroundColor: styles.vars.bg,
            borderRadius: 4,
            margin: 4,
            padding: 4,
            height: 24
        };
        const textStyle = {
            color: 'white'
        };
        return (
            <View key={i} style={style}>
                <Text style={textStyle}>{contact.username}</Text>
            </View>
        );
    }

    @observable recipients = [];

    userboxline() {
        const container = {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 8,
            flexWrap: 'wrap'
        };
        const boxes = this.recipients.map(this.userbox);

        return (
            <View style={container}>
                {boxes}
            </View>
        );
    }

    @observable findUserText = '';

    onChangeFindUserText(text) {
        this.findUserText = text;
        if (text && text.length > 0) {
            this.searchUser(text);
        }
    }

    textbox() {
        const container = {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
        };
        const style = {
            flex: 1,
            marginLeft: 8
        };

        return (
            <View style={container}>
                {icons.dark('search')}
                <TextInput
                    value={this.findUserText}
                    onChangeText={text => this.onChangeFindUserText(text)}
                    autoCorrect={false}
                    placeholder="Find someone"
                    ref={ti => (this.textInput = ti)} style={style} />
            </View>
        );
    }

    exitRow() {
        const container = {
            flex: 1,
            flexDirection: 'row'
        };
        const style = {
            flex: 1
        };
        const textStyle = {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000000AA'

        };
        return (
            <View style={container}>
                {icons.dark('close', this.exit)}
                <Center style={style}><Text style={textStyle}>New message</Text></Center>
            </View>
        );
    }

    addRecipient(contact) {
        if (this.recipients.indexOf(contact) === -1) {
            this.found = [];
            this.findUserText = '';
            this.recipients.push(contact);
        }
    }

    item(contact, i) {
        const { username /* , message */ } = contact;
        return (
            <Avatar key={i} name={username} message={username} hideOnline onPress={() => this.addRecipient(contact)} />
        );
    }

    // listBlock(header, items) {
    //     return (
    //         <View>
    //             <Text>Your contacts:</Text>
    //         </View>
    //     );
    // }

    @observable found = [];

    searchUser(username) {
        const c = contactStore.getContact(username);
        when(() => !c.loading, () => {
            if (!c.notFound) {
                this.found = [c];
            }
        });
    }

    body() {
        const mockItems = this.found.map((item, i) => this.item(item, i));

        return (
            <View>
                {mockItems}
            </View>
        );
    }

    lineBlock(content) {
        const s = {
            paddingLeft: 14,
            paddingRight: 14,
            paddingBottom: 8,
            marginBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#EAEAEA'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    header() {
        const tbSearch = this.textbox();
        const userRow = this.userboxline();
        const exitRow = this.exitRow();
        return (
            <View>
                {this.lineBlock(exitRow)}
                {this.recipients.length ? this.lineBlock(userRow) : null}
                {this.lineBlock(tbSearch)}
            </View>
        );
    }

    renderInput() {
        const s = {
            flex: 0,
            borderTopColor: '#EFEFEF',
            borderTopWidth: 1,
            backgroundColor: '#fff'
        };
        return (
            <View style={s}>
                <InputMain send={this.send} />
            </View>
        );
    }

    send() {
        const chat = chatStore.startChat(this.recipients);
        chat.addMessage('test');
    }

    render() {
        const header = this.header();
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        const footer = this.recipients.length ? this.renderInput() : null;
        return (
            <Layout1
                defaultBar
                noFitHeight
                body={body}
                footer={footer}
                header={header}
                style={layoutStyle} />
        );
    }
}

