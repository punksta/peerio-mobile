import React, { Component } from 'react';
import {
    View, Text, TextInput, ActivityIndicator
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
import mainState from '../main/main-state';
import Chat from './chat';
import { chatStore, contactStore } from '../../lib/icebear';

@observer
export default class ComposeMessage extends Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount() {
        // setTimeout(() => this.textInput.focus(), 100);
        // this.searchAddUser('anritest7');
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


    userboxline() {
        const container = {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 8,
            flexWrap: 'wrap'
        };
        const boxes = messagingState.recipients.map(this.userbox);

        return (
            <View style={container}>
                {boxes}
            </View>
        );
    }

    onChangeFindUserText(text) {
        messagingState.findUserText = text;
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
                    value={messagingState.findUserText}
                    onChangeText={text => this.onChangeFindUserText(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Find someone by username"
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
        const recipients = messagingState.recipients;
        if (recipients.indexOf(contact) === -1) {
            this.found = [];
            messagingState.findUserText = '';
            recipients.push(contact);
            const chat = chatStore.findChatWithParticipants(recipients);
            if (chat) {
                messagingState.currentChat = chat;
                mainState.currentChat = chat;
                chat.loadMessages();
            }
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
        this.loading = true;
        when(() => !c.loading, () => {
            this.loading = false;
            if (!c.notFound) {
                this.found = [c];
            }
        });
    }

    searchAddUser(username) {
        const c = contactStore.getContact(username);
        this.loading = true;
        when(() => !c.loading, () => {
            this.loading = false;
            if (!c.notFound) {
                // this.addRecipient(c);
            }
        });
    }

    body() {
        const mockItems = this.found.map((item, i) => this.item(item, i));
        const activityIndicator = <ActivityIndicator />;
        const chat = messagingState.chat ? <Chat hideInput /> : null;
        const findUserText = messagingState.findUserText;
        const result = findUserText && findUserText.length ? mockItems : chat;
        const body = messagingState.loading ? activityIndicator : result;
        return (
            <View>
                {body}
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
        const recipients = messagingState.recipients;
        return (
            <View>
                {this.lineBlock(exitRow)}
                {recipients.length ? this.lineBlock(userRow) : null}
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

    send(text) {
        messagingState.send(text);
    }

    render() {
        const header = this.header();
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        const footer = messagingState.recipients.length ? this.renderInput() : null;
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

