import React, { Component } from 'react';
import {
    ScrollView, ListView, View, ActivityIndicator
} from 'react-native';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import mainState from '../main/main-state';
import state from '../layout/state';
import ChatItem from './chat-item';
import InputMain from '../layout/input-main';
import SnackBar from '../snackbars/snackbar';

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
    'Okay I\'ll fetch some'
];

// max new items which are scrolled animated
const maxScrollableLength = 3;

@observer
export default class Chat extends Component {
    @observable contentHeight = 0;
    @observable scrollViewHeight = 0;
    enableNextScroll = false;
    lastLength = 0;

    constructor(props) {
        super(props);
        this.send = this.send.bind(this);
        this.sendAck = this.sendAck.bind(this);
        this.layoutScrollView = this.layoutScrollView.bind(this);
        this.scroll = this.scroll.bind(this);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    get data() {
        return (mainState.currentChat && mainState.currentChat.messages) || [];
    }

    componentWillMount() {
        reaction(() => this.data.length, (l) => {
            this.enableNextScroll = (l - this.lastLength) < maxScrollableLength;
            this.lastLength = l;
        });
        // this.reaction = reaction(() => (mainState.route === 'chat') && this.data && this.data.length, () => {
        //     console.log(`chat.js update reaction ${this.data.length}`);
        //     this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
        //     this.forceUpdate();
        // }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    send(v) {
        const message = v;
        if (!message || !message.length) {
            this.sendAck();
            return;
        }
        this.enableNextScroll = true;
        mainState.addMessage(message);
    }

    sendAck() {
        this.enableNextScroll = true;
        mainState.addAck();
    }

    // setFocus() {
    //     this.input && this.input.setFocus();
    // }

    renderInput() {
        const s = {
            minHeight: 80,
            borderTopColor: 'rgba(0, 0, 0, .12)',
            borderTopWidth: 1,
            backgroundColor: '#fff'
        };
        return (
            <View style={s}>
                <InputMain
                    sendAck={this.sendAck}
                    send={this.send} />
            </View>
        );
    }

    item(chat, i) {
        return <ChatItem key={chat.id || i} chat={chat} />;
    }

    layoutScrollView(event) {
        console.log('chat.js: layout scroll view');
        this.scrollViewHeight = event.nativeEvent.layout.height;
        console.log(this.scrollViewHeight);
        // console.log(`layout sv: ${this.scrollViewHeight}`);
        this.scroll();
    }

    scroll(contentWidth, contentHeight) {
        if (!this.scrollView) return;
        if (contentHeight) {
            this.contentHeight = contentHeight;
        }

        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            if (this.scrollView && this.contentHeight && this.scrollViewHeight) {
                const y = this.contentHeight - this.scrollViewHeight; // + state.keyboardHeight;
                console.log(y);
                if (y < 0) return;
                const animated = this.enableNextScroll;
                this.scrollView.scrollTo({ y, animated });
                this.enableNextScroll = false;
            } else {
                setTimeout(() => this.scroll(), 1000);
            }
        }, 100);
    }

    listView() {
        return (
            <ScrollView
                onLayout={this.layoutScrollView}
                style={{ flexGrow: 1 }}
                initialListSize={1}
                onContentSizeChange={this.scroll}
                enableEmptySections
                ref={sv => (this.scrollView = sv)}>
                {this.data.map(this.item)}
            </ScrollView>
        );

//         return (
//             <ListView
//                 initialListSize={1}
//                 dataSource={this.dataSource}
//                 renderRow={this.item}
//                 onContentSizeChange={this.scroll}
//                 enableEmptySections
//                 ref={sv => (this.scrollView = sv)}
//             />
//         );
    }

    render() {
        // const shift = this.contentHeight - (this.scrollViewHeight - state.keyboardHeight);
        // const paddingTop = !!this.scrollViewHeight &&
        //     (global.platform === 'android') && (shift < 0) ? -shift : 0;
        // const scrollEnabled = !!this.scrollViewHeight && (shift > 0);
        // console.log('render');
        // console.log(`content height: ${this.contentHeight}`);
        // console.log(`sv height: ${this.scrollViewHeight}`);
        // console.log(scrollEnabled);
        const paddingTop = 0;
        const visible = true; // this.scrollViewHeight && mainState.canSend;
        const body = visible ? this.listView() : (
            <ActivityIndicator style={{ paddingTop: 10 }} />
        );
        return (
            <View
                style={{ flexGrow: 1, paddingTop }}>
                {body}
                <SnackBar />
                {visible ? this.renderInput() : null}
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: React.PropTypes.bool
};

