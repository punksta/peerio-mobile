import React, { Component } from 'react';
import {
    ScrollView, View, Text, TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import styles from '../../styles/styles';
import mainState from '../main/main-state';
import InputMain from '../layout/input-main';

const avatarRadius = 36;

const avatarStyle = {
    width: avatarRadius,
    height: avatarRadius,
    borderRadius: avatarRadius / 2,
    backgroundColor: '#CFCFCF',
    margin: 4
};

const nameContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
};

const nameMessageContainerStyle = {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 6
};

const nameTextStyle = {
    fontWeight: '500'
};

const lastMessageTextStyle = {
    color: '#000000CC'
};

const dateTextStyle = {
    fontSize: 11,
    color: '#0000009A',
    marginLeft: 6
};

const itemStyle = {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    alignItems: 'flex-start',
    backgroundColor: 'white'
};

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

    send(v) {
        const message = v || _.sample(randomMessages);
        console.log(v);
        mainState.addMessage({
            name: 'Alice',
            date: '2:40PM',
            message
        });
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

    item(i, key) {
        const msg = i.message || '';
        const text = msg.replace(/[ ]+/g, ' ');
        return (
            <View style={{ backgroundColor: styles.vars.bg }} key={key}>
                <TouchableOpacity>
                    <View key={key} style={itemStyle}>
                        <View style={avatarStyle} />
                        <View style={nameMessageContainerStyle}>
                            <View style={nameContainerStyle}>
                                <Text style={nameTextStyle}>{i.name}</Text>
                                <Text style={dateTextStyle}>{i.date}</Text>
                            </View>
                            <Text style={lastMessageTextStyle}>{text}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    @observable contentHeight = 0;

    layoutScrollView(event) {
        this.scrollViewHeight = event.nativeEvent.layout.height;
    }

    layoutChat(event) {
        console.log('layout');
        this.contentHeight = event.nativeEvent.layout.height;
        console.log(this.contentHeight);
        console.log(this.scrollViewHeight);
        this.scrollView.scrollTo({ y: this.contentHeight - this.scrollViewHeight, animated: true });
    }

    scroll() {
    }

    render() {
        const items = mainState.chatItems;
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
                {this.renderInput()}
            </View>
        );
    }
}
