import React from 'react';
import { observer } from 'mobx-react/native';
import { SectionList } from 'react-native';
import { reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import chatState from '../messaging/chat-state';
import FileItem from '../files/file-item';
import ChatInfoSectionHeading from '../messaging/chat-info-section-heading';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 10;

@observer
export default class RecentFilesList extends SafeComponent {
    dataSource = [];

    get data() { return chatState.currentChat.recentFiles; }

    get hasData() {
        return this.dataSource[0] && this.dataSource[0].data.length;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data,
            this.data.length
        ], () => {
            this.dataSource = [{ data: this.data.slice(), key: tx('title_recentFiles') }];
            this.forceUpdate();
        }, true);
    }

    item({ item }) {
        const fileId = item;
        const file = fileState.store.getById(fileId);
        console.log(file);
        if (!file) return null;
        return (
            <FileItem
                key={fileId}
                file={file}
                isRecentFile />
        );
    }

    header({ section: { key } }) {
        return <ChatInfoSectionHeading key={key} title={key} state="collapseRecentFiles" collapsible={chatState.currentChat.isChannel} />;
    }

    renderThrow() {
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={fileId => fileId}
                renderItem={this.item}
                renderSectionHeader={this.hasData ? this.header : null}
                style={{ marginBottom: 8 }}
            />);
    }
}
