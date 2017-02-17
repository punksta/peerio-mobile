import React, { Component } from 'react';
import {
    View,
    ListView,
    ScrollView,
    Animated
} from 'react-native';
import { MenuContext } from 'react-native-menu';
import { observable /* , reaction */ } from 'mobx';
import { observer } from 'mobx-react/native';
// import { vars } from '../../styles/styles';
import GhostsZeroState from './ghosts-zero-state';
import ProgressOverlay from '../shared/progress-overlay';
// import styles, { vars } from '../../styles/styles';
import GhostItem from './ghost-item';
import { mailStore } from '../../lib/icebear';

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
        return mailStore.ghosts;
    }

    componentWillMount() {
        // this.reaction = reaction(() => [
        //     mainState.route === 'ghosts',
        //     mainState.currentIndex === 0,
        //     this.data,
        //     this.data.length
        // ], () => {
        //     console.log(`ghosts.js: force update`);
        //     this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
        //     this.forceUpdate();
        //     setTimeout(() => this.forceUpdate(), 1000);
        // }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    item(ghost) {
        return (
            <GhostItem key={ghost.ghostId} ghost={ghost} />
        );
    }

    listView() {
        return (
            <ScrollView
                initialListSize={1}
                dataSource={this.dataSource}
                renderRow={this.item}
                enableEmptySections
                ref={sv => (this.scrollView = sv)}>
                {this.data.map(i => this.item(i))}
            </ScrollView>
        );
    }

    render() {
        const body = this.data.length ?
            this.listView() : !mailStore.loading && <GhostsZeroState />;

        return (
            <View
                style={{ flex: 1, flexGrow: 1 }}>
                <MenuContext>
                    {body}
                </MenuContext>
                <ProgressOverlay enabled={mailStore.loading} />
            </View>
        );
    }
}
