import React, { Component } from 'react';
import {
    View,
    ScrollView,
    PanResponder,
    LayoutAnimation
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import state from './state';
import mainState from '../main/main-state';
import LeftMenu from '../main/left-menu';
import RightMenu from '../main/right-menu';
import HeaderMain from './header-main';
import InputMain from './input-main';
import TextIpsum from './text-ipsum';
import RecentList from '../main/recent-list';
import Chat from '../messaging/chat';
import styles from '../../styles/styles';

const routes = ({
    recent: () => <RecentList />,
    chat: () => <Chat />,
    ipsum: () => <TextIpsum />
});

const current = observable({
    control: null
});

reaction(() => mainState.route, () => {
    console.log('transitioning');
    console.log(mainState.route);
    const r = routes[mainState.route];
    current.control = r();
});

@observer
export default class LayoutMain extends Component {
    constructor(props) {
        super(props);
        this.hideMenus = this.hideMenus.bind(this);
        this.send = this.send.bind(this);
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (/* evt, gestureState */) => {
                this.hideMenus();
                return false;
            }
        });
        mainState.recent();
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    hideMenus() {
        mainState.isLeftMenuVisible = false;
        mainState.isRightMenuVisible = false;
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

    send(v) {
        console.log(v);
        mainState.addMessage({
            name: 'Alice',
            date: '2:40PM',
            message: v
        });
    }

    render() {
        const control = current.control;
        const input = mainState.isInputVisible ? this.renderInput() : null;
        return (
            <View style={styles.container.root}>
                <HeaderMain />
                <View
                    {...this.panResponder.panHandlers}
                    behavior="padding"
                    style={{
                        backgroundColor: 'white',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        paddingBottom: state.keyboardHeight
                    }}>
                    <ScrollView
                        style={{ flex: 1, backgroundColor: '#fff' }}>
                        {control}
                    </ScrollView>
                    {input}
                </View>
                <LeftMenu />
                <RightMenu />
            </View>
        );
    }
}

LayoutMain.propTypes = {
    body: React.PropTypes.any,
    footer: React.PropTypes.any
};
