import React, { Component } from 'react';
import {
    ScrollView, View
} from 'react-native';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';
import mainState from '../main/main-state';
import InputMain from '../layout/input-main';
import Avatar from '../shared/avatar';

const randomMessages = [
    'I did not know what to say so I wrote this',
    'Who do you think will win?',
    'How do you think Putin is going to be saving his wealth?',
    'Poison',
    'Power and domination',
    'Useless icecream',
    'Wordly debates on otherworldly problems',
    'I would love some beer',
    'I would love some wine',
    'Okay I\'ll fetch some'];

@observer
export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.send = this.send.bind(this);
        this.layoutChat = this.layoutChat.bind(this);
        this.layoutScrollView = this.layoutScrollView.bind(this);
        this.scroll = this.scroll.bind(this);
    }

    componentWillMount() {
        // when(() => mainState.chat != null, () => mainState.chat.loadMessages());
    }

    send(v) {
        const message = v || _.sample(randomMessages);
        console.log(v);
        mainState.addMessage(message);
    }

    setFocus() {
        this.input && this.input.setFocus();
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
                <InputMain ref={i => (this.input = i)} send={this.send} />
            </View>
        );
    }

    item(i, key) {
        const msg = i.text || '';
        const name = i.sender.username;
        const text = msg.replace(/\n[ ]+/g, '\n');
        return (
            <Avatar
                hideOnline
                date={'12:00'}
                name={name}
                message={text}
                key={key} />
        );
    }

    @observable contentHeight = 0;

    layoutScrollView(event) {
        this.scrollViewHeight = event.nativeEvent.layout.height;
        this.scroll();
    }

    @observable firstLayout = true;

    layoutChat(event) {
        console.log('layout');
        this.contentHeight = event.nativeEvent.layout.height;
        console.log(this.contentHeight);
        console.log(this.scrollViewHeight);
    }

    scroll(contentWidth, contentHeight) {
        this.contentHeight = contentHeight;
        if (this.contentHeight && this.scrollViewHeight) {
            this.scrollView.scrollTo({ y: this.contentHeight - this.scrollViewHeight, animated: !this.props.hideInput && !this.firstLayout });
            this.firstLayout = false;
        } else {
            setTimeout(() => this.scroll(), 100);
        }
    }

    render() {
        const items = (mainState.currentChat && mainState.currentChat.messages) || [];
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    onLayout={this.layoutScrollView}
                    onContentSizeChange={this.scroll}
                    ref={sv => (this.scrollView = sv)}
                    >
                    <View onLayout={this.layoutChat}>
                        { items.map(this.item) }
                    </View>
                </ScrollView>
                {this.props.hideInput ? null : this.renderInput()}
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: React.PropTypes.bool
};

