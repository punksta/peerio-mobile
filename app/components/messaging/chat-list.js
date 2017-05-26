import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, Animated } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import MessagingPlaceholder from './messaging-placeholder';
import ChatListItem from './chat-list-item';
import ProgressOverlay from '../shared/progress-overlay';
import chatState from './chat-state';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

@observer
export default class Files extends SafeComponent {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    get isFabVisible() { return true; }

    @observable dataSource = null;
    @observable refreshing = false
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;
    actionsHeight = new Animated.Value(0)

    get data() {
        return chatState.store.chats;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            chatState.routerMain.route === 'chats',
            chatState.routerMain.currentIndex === 0,
            this.data,
            this.data.length,
            this.maxLoadedIndex
        ], () => {
            console.log(`chat-list.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice(0, this.maxLoadedIndex));
            this.forceUpdate();
        }, true);
    }

    item(chat) {
        return (
            <ChatListItem key={chat.id} chat={chat} />
        );
    }

    onEndReached = () => {
        console.log('files.js: on end reached');
        this.maxLoadedIndex += PAGE_SIZE;
    }

    listView() {
        if (chatState.routerMain.currentIndex !== 0) return null;
        return (
            <ListView
                style={{ flexGrow: 1 }}
                initialListSize={INITIAL_LIST_SIZE}
                pageSize={PAGE_SIZE}
                dataSource={this.dataSource}
                renderRow={this.item}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={20}
                onContentSizeChange={this.scroll}
                enableEmptySections
                ref={sv => (this.scrollView = sv)}
            />
        );
    }

    renderThrow() {
        const body = (this.data.length && chatState.store.loaded) ?
            this.listView() : <MessagingPlaceholder />;

        return (
            <View
                style={{ flexGrow: 1 }}>
                <View style={{ flexGrow: 1 }}>
                    {body}
                </View>
                <ProgressOverlay enabled={chatState.store.loading} />
            </View>
        );
    }
}
