import React, { Component } from 'react';
import {
    View, Text, TextInput
} from 'react-native';
import Layout1 from '../layout/layout1';
import Center from '../controls/center';
import Avatar from '../shared/avatar';
import icons from '../helpers/icons';
import styles from '../../styles/styles';
import InputMain from '../layout/input-main';
import messagingState from './messaging-state';

export default class ComposeMessage extends Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this);
    }

    componentDidMount() {
        // setTimeout(() => this.textInput.focus(), 100);
    }

    exit() {
        messagingState.exit();
    }

    userbox(username, i) {
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
                <Text style={textStyle}>{username}</Text>
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
        const users = ['testdm10', 'testdm20', 'testdm30', 'testdm50', 'testdm60', 'test11111111111'];
        const boxes = users.map(this.userbox);

        return (
            <View style={container}>
                {boxes}
            </View>
        );
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

    item(i, text) {
        return (
            <Avatar key={i} name={text} message={text} hideOnline />
        );
    }

    listBlock(header, items) {
        return (
            <View>
                <Text>Your contacts:</Text>
            </View>
        );
    }

    body() {
        const mockItems = [];
        for (let i = 0; i < 50; ++i) {
            mockItems.push(this.item(i, `test item ${i}`));
        }

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
                {this.lineBlock(userRow)}
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
    }

    render() {
        const header = this.header();
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        const footer = null; // this.renderInput();
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

