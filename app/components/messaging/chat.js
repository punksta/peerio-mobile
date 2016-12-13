import React, { Component } from 'react';
import {
    ListView, View, ActivityIndicator
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

@observer
export default class Chat extends Component {
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
        this.reaction = reaction(() => (mainState.route === 'chat') && this.data && this.data.length, () => {
            console.log(`chat.js update reaction ${this.data.length}`);
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
            this.forceUpdate();
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    send(v) {
        const message = v || (__DEV__ && _.sample(randomMessages));
        if (!message) return;
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
            flex: 0,
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

    item(chat) {
        return <ChatItem chat={chat} />;
    }

    @observable contentHeight = 0;
    @observable scrollViewHeight = 0;
    @observable enableNextScroll = false;

    layoutScrollView(event) {
        this.scrollViewHeight = this.scrollViewHeight || event.nativeEvent.layout.height;
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
                const y = this.contentHeight - this.scrollViewHeight + state.keyboardHeight;
                const animated = true; // !this.props.hideInput && this.enableNextScroll;
                this.scrollView.scrollTo({ y, animated });
                this.enableNextScroll = false;
            } else {
                // setTimeout(() => this.scroll(), 1000);
            }
        }, 100);
    }

    listView() {
        return (
            <ListView
                initialListSize={1}
                dataSource={this.dataSource}
                renderRow={this.item}
                onContentSizeChange={this.scroll}
                enableEmptySections
                ref={sv => (this.scrollView = sv)}
            />
        );
    }

    render() {
        const shift = this.contentHeight - (this.scrollViewHeight - state.keyboardHeight);
        const paddingTop = !!this.scrollViewHeight &&
            (global.platform === 'android') && (shift < 0) ? -shift : 0;
        // const scrollEnabled = !!this.scrollViewHeight && (shift > 0);
        // console.log('render');
        // console.log(`content height: ${this.contentHeight}`);
        // console.log(`sv height: ${this.scrollViewHeight}`);
        // console.log(scrollEnabled);
        const body = this.scrollViewHeight && mainState.canSend ?
            this.listView() : <ActivityIndicator style={{ paddingBottom: 10 }} />;
        return (
            <View
                style={{ flex: 1, paddingTop }}>
                <View
                    style={{ flex: 1 }}
                    onLayout={this.layoutScrollView}>
                    {body}
                </View>
                <SnackBar />
                {this.props.hideInput ? null : this.renderInput()}
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: React.PropTypes.bool
};

