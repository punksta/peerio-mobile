import React, { Component } from 'react';
import {
    ScrollView, View, RefreshControl, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import ProgressOverlay from '../shared/progress-overlay';
import Paging from '../shared/paging';
import ChatItem from './chat-item';
import FileInlineProgress from '../files/file-inline-progress';
import AvatarCircle from '../shared/avatar-circle';
import mainState from '../main/main-state';
import { vars } from '../../styles/styles';

// max new items which are scrolled animated
const maxScrollableLength = 3;

@observer
export default class Chat extends Component {
    @observable contentHeight = 0;
    @observable scrollViewHeight = 0;
    @observable refreshing = false;
    enableNextScroll = false;
    lastLength = 0;

    paging = new Paging();

    constructor(props) {
        super(props);
        this.layoutScrollView = this.layoutScrollView.bind(this);
        this.scroll = this.scroll.bind(this);
        // this.dataSource = new ListView.DataSource({
        //     rowHasChanged: (r1, r2) => r1 !== r2
        // });
    }

    get data() {
        return this.paging.data;
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
        // console.log(this.scrollViewHeight);
        this.paging.hasMore && this.paging.updateFrame();
        // console.log(`layout sv: ${this.scrollViewHeight}`);
        this.scroll();
    }

    scroll(contentWidth, contentHeight) {
        if (!this.scrollView) return;

        if (this.refreshing) {
            let y = (contentHeight - this.contentHeight) / 2;
            if (y < 0) y = 0;
            this.scrollView.scrollTo({ y, animated: false });
            this.refreshing = false;
            this.contentHeight = contentHeight;
            return;
        }

        if (contentHeight) {
            this.contentHeight = contentHeight;
        }

        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

        this.scrollTimeout = setTimeout(() => {
            if (this.scrollView && this.contentHeight && this.scrollViewHeight) {
                let y = this.contentHeight - this.scrollViewHeight; // + state.keyboardHeight;
                if (y < 0) {
                    console.log('chat.js: less content than fit');
                    this.paging.hasMore && this.paging.loadNext();
                    y = 0;
                }
                const animated = this.enableNextScroll;
                this.scrollView.scrollTo({ y, animated });
                this.enableNextScroll = false;
            } else {
                setTimeout(() => this.scroll(), 1000);
            }
        }, 100);
    }

    _onRefresh() {
        this.refreshing = true;
        this.paging.hasMore && setTimeout(() => this.paging.loadNext(), 500);
        setTimeout(() => (this.refreshing = false), 1000);
    }

    listView() {
        const refreshControl = this.paging.hasMore ? (
            <RefreshControl
                refreshing={this.refreshing}
                onRefresh={() => this._onRefresh()}
            />
        ) : null;
        return (
            <ScrollView
                onLayout={this.layoutScrollView}
                refreshControl={refreshControl}
                style={{ flexGrow: 1 }}
                initialListSize={1}
                onContentSizeChange={this.scroll}
                enableEmptySections
                ref={sv => (this.scrollView = sv)}>
                {!this.paging.loading && !this.paging.hasMore && this.zeroStateItem()}
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

    uploadQueue() {
        const q = this.paging.chat ? this.paging.chat.uploadQueue : [];
        return q.map(f => <FileInlineProgress key={f.fileId} file={f.fileId} />);
    }

    zeroStateItem() {
        const zsContainer = {
            borderBottomWidth: 1,
            borderBottomColor: '#CFCFCF'
        };
        const chat = this.paging.chat;
        const avatars = chat.participants.map(contact => (
            <TouchableOpacity
                onPress={() => mainState.contactView(contact)} key={contact.username}>
                <AvatarCircle
                    contact={contact}
                    medium />
            </TouchableOpacity>
        ));
        return (
            <View style={zsContainer}>
                <View style={{ flexDirection: 'row' }}>{avatars}</View>
                <Text style={{ textAlign: 'center', margin: 12, color: vars.txtMedium }}>
                    {'This is the beginning of your chat history with '}
                    <Text style={{ fontWeight: 'bold' }}>
                        {chat.participantUsernames}
                    </Text>
                </Text>
            </View>
        );
    }

    render() {
        return (
            <View
                style={{ flexGrow: 1 }}>
                {this.listView()}
                <View style={{ margin: 12 }}>
                    {this.uploadQueue()}
                </View>
                <ProgressOverlay enabled={this.paging.loading} />
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: React.PropTypes.bool
};

