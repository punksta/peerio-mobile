import React, { Component } from 'react';
import {
    View,
    ListView,
    Animated
} from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
// import { vars } from '../../styles/styles';
import GhostsZeroState from './ghosts-zero-state';
// import styles, { vars } from '../../styles/styles';
import GhostItem from './ghost-item';
// import FileActions from './file-actions';
// import ghostState from './ghost-state';
import mainState from '../main/main-state';

@observer
export default class Ghosts extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }
    get isFabVisible() { return true; }

    @observable dataSource = null;
    @observable refreshing = false
    actionsHeight = new Animated.Value(0)

    get data() {
        return [];
        // return fileStore.files.sort((f1, f2) => {
        //     return f2.uploadedAt - f1.uploadedAt;
        // });
    }

    componentWillMount() {
        this.reaction = reaction(() => (mainState.route === 'ghosts') && this.data && this.data.length, () => {
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
            this.forceUpdate();
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    item(file) {
        return (
            <GhostItem key={file.fileId} file={file} />
        );
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
        const body = this.data.length ?
            this.listView() : <GhostsZeroState />;

        return (
            <View
                style={{ flex: 1, flexGrow: 1 }}>
                {body}
            </View>
        );
    }
}
