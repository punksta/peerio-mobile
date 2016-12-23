import React, { Component } from 'react';
import {
    ScrollView, ListView, View, ActivityIndicator
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import mainState from '../main/main-state';
import ChatItem from './chat-item';

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
        this.layoutScrollView = this.layoutScrollView.bind(this);
        this.scroll = this.scroll.bind(this);
        // this.dataSource = new ListView.DataSource({
        //     rowHasChanged: (r1, r2) => r1 !== r2
        // });
    }

    get data() {
        return (mainState.currentChat && mainState.currentChat.messages) || [];
    }

    get showInput() {
        return true;
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

    // componentWillUnmount() {
    //     this.reaction && this.reaction();
    //     this.reaction = null;
    // }

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
                let y = this.contentHeight - this.scrollViewHeight; // + state.keyboardHeight;
                console.log(y);
                if (y < 0) y = 0;
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
        return (
            <View
                style={{ flexGrow: 1 }}>
                {this.listView()}
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: React.PropTypes.bool
};

