import React, { Component } from 'react';
import {
    ScrollView, View, ActivityIndicator
} from 'react-native';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import mainState from '../main/main-state';
import state from '../layout/state';
import InputMain from '../layout/input-main';
import Avatar from '../shared/avatar';
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
    'Okay I\'ll fetch some'];

@observer
export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.send = this.send.bind(this);
        this.layoutScrollView = this.layoutScrollView.bind(this);
        this.scroll = this.scroll.bind(this);
    }

    componentWillMount() {
        // when(() => mainState.chat != null, () => mainState.chat.loadMessages());
    }

    send(v) {
        const message = v || (__DEV__ && _.sample(randomMessages));
        if (!message) return;
        this.enableNextScroll = true;
        mainState.addMessage(message);
    }

    setFocus() {
        this.input && this.input.setFocus();
    }

    renderInput() {
        const s = {
            flex: 0,
            borderTopColor: 'rgba(0, 0, 0, .12)',
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
        const timestamp = i.timestamp;
        const name = i.sender.username;
        const color = i.sender.color;
        const text = msg.replace(/\n[ ]+/g, '\n');
        return (
            <Avatar
                color={color}
                hideOnline
                date={timestamp}
                name={name}
                message={text}
                key={key}
                noBorderBottom
            />
        );
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
        if (contentHeight) {
            this.contentHeight = contentHeight;
        }
        if (this.contentHeight && this.scrollViewHeight) {
            const y = this.contentHeight - this.scrollViewHeight + state.keyboardHeight;
            const animated = !this.props.hideInput && this.enableNextScroll;
            this.scrollView.scrollTo({ y, animated });
            this.enableNextScroll = false;
        } else {
            setTimeout(() => this.scroll(), 1000);
        }
    }

    render() {
        const items = (mainState.currentChat && mainState.currentChat.messages) || [];
        const shift = this.contentHeight - (this.scrollViewHeight - state.keyboardHeight);
        const paddingTop = !!this.scrollViewHeight &&
            (global.platform === 'android') && (shift < 0) ? -shift : 0;
        const scrollEnabled = !!this.scrollViewHeight && (shift > 0);
        // console.log('render');
        // console.log(`content height: ${this.contentHeight}`);
        // console.log(`sv height: ${this.scrollViewHeight}`);
        // console.log(scrollEnabled);
        const body = (this.scrollViewHeight && mainState.canSend) ?
            items.map(this.item) : <ActivityIndicator style={{ paddingBottom: 10 }} />;
        return (
            <View
                style={{ flex: 1, paddingTop }}>
                <ScrollView
                    scrollEnabled={scrollEnabled}
                    onLayout={this.layoutScrollView}
                    onContentSizeChange={this.scroll}
                    ref={sv => (this.scrollView = sv)}
                    >
                    <View style={{ flex: 0 }}>
                        {body}
                    </View>
                </ScrollView>
                <SnackBar />
                {this.props.hideInput ? null : this.renderInput()}
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: React.PropTypes.bool
};

