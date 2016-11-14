import React, { Component } from 'react';
import {
    View, Text, TextInput, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import { when } from 'mobx';
import Layout1 from '../layout/layout1';
import Center from '../controls/center';
import Avatar from '../shared/avatar';
import icons from '../helpers/icons';
import styles from '../../styles/styles';
import messagingState from './messaging-state';
import { contactStore } from '../../lib/icebear';

@observer
export default class ComposeMessage extends Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this);
    }

    exit() {
        messagingState.exit();
    }

    removeRecipient(c) {
        messagingState.remove(c);
    }

    userbox(contact, i) {
        const style = {
            backgroundColor: styles.vars.bg,
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 4,
            padding: 4,
            paddingLeft: 12,
            height: 32
        };
        const textStyle = {
            color: 'white'
        };
        return (
            <TouchableOpacity key={i} onPress={() => this.removeRecipient(contact)}>
                <View style={style}>
                    <Text style={textStyle}>{contact.username}</Text>
                    {/* TODO: add cancel icon*/}
                </View>
            </TouchableOpacity>
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
        const boxes = messagingState.recipients.map((c, i) => this.userbox(c, i));

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
            flexDirection: 'row',
            alignItems: 'center',
            height: 48
        };
        const style = {
            flex: 1
        };
        const textStyle = {
            fontSize: 14,
            fontWeight: styles.vars.font.weight.semiBold,
            color: 'rgba(0, 0, 0, .54)'
        };
        const goStyle = {
            fontSize: 14,
            fontWeight: styles.vars.font.weight.semiBold,
            color: styles.vars.bg
        };
        return (
            <View style={container}>
                {icons.dark('close', this.exit)}
                <Center style={style}><Text style={textStyle}>New message</Text></Center>
                {messagingState.recipients.length ?
                    icons.text('GO', () => messagingState.send(), goStyle) : icons.placeholder()}
            </View>
        );
    }

    item(contact, i) {
        const { username, color /* , message */ } = contact;
        return (
            <Avatar
                checkbox
                color={color}
                checkedKey={username}
                checkedState={messagingState.recipientsMap}
                key={username || i}
                name={username}
                message={username}
                hideOnline
                onPress={() => messagingState.toggle(contact)} />
        );
    }

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

    body() {
        const found = messagingState.filtered;
        const mockItems = found.map((item, i) => this.item(item, i));
        const activityIndicator = <ActivityIndicator />;
        // const result = findUserText && findUserText.length ? mockItems : chat;
        const result = mockItems;
        const body = messagingState.loading ? activityIndicator : result;
        return (
            <View>
                {body}
            </View>
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

    header() {
        const tbSearch = this.textbox();
        const userRow = this.userboxline();
        const exitRow = this.exitRow();
        const recipients = messagingState.recipients;
        return (
            <View>
                {this.lineBlock(exitRow)}
                {/*TODO combine recipients and search */}
                {recipients.length ? this.lineBlock(userRow) : null}
                {this.lineBlock(tbSearch)}
            </View>
        );
    }

    render() {
        const header = this.header();
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout1
                defaultBar
                noFitHeight
                body={body}
                header={header}
                style={layoutStyle} />
        );
    }
}

