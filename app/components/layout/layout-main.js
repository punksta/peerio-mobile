import React, { Component } from 'react';
import {
    View,
    PanResponder,
    StatusBar,
    Animated,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import { reaction } from 'mobx';
import state from './state';
import mainState from '../main/main-state';
import LeftMenu from '../main/left-menu';
import RightMenu from '../main/right-menu';
import HeaderMain from './header-main';
import Chat from '../messaging/chat';
import Files from '../files/files';
import FileView from '../files/file-view';
import ComposeMessage from '../messaging/compose-message';
// import Placeholder from './placeholder';
import MessagingPlaceholder from '../messaging/messaging-placeholder';
import styles, { vars } from '../../styles/styles';

const routes = {
    recent: [<MessagingPlaceholder />],
    files: [<Files />, <FileView />],
    chat: [<Chat />]
};

@observer
export default class LayoutMain extends Component {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
        this.currentIndex = mainState.currentIndex;
        this.animatedX = new Animated.Value(0);
        this.leftMenuAnimated = new Animated.Value(0);
        this.composeAnimated = new Animated.Value(this.height);
        this.indexAnimation = reaction(() => mainState.currentIndex, i => {
            console.log('layout-main.js: index animation');
            const toValue = -i * this.width;
            const duration = mainState.suppressTransition ? 0 : vars.animationDuration;
            Animated.timing(this.animatedX, { toValue, duration })
                .start(() => {
                    this.currentIndex = i;
                    if (this.currentIndex === 1) {
                        // mainState.suppressTransition; // && this.chatControl.setFocus();
                    }
                    mainState.suppressTransition = false;
                });
        }, true);
        this.leftMenuAnimation = reaction(() => mainState.isLeftMenuVisible, v => {
            const toValue = v ? this.width * vars.menuWidthRatio : 0;
            Animated.timing(this.leftMenuAnimated, { toValue, duration: vars.animationDuration })
                .start();
        }, true);
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (/* evt, gestureState */) => {
                mainState.resetMenus();
                return false;
            }
        });
        mainState.initial();
    }

    componentDidMount() {
        reaction(() => mainState.showCompose, () => {
            if (mainState.showCompose) {
                console.log('layout-main.js: show compose');
                Animated.timing(this.composeAnimated, { toValue: 0, duration: 300 })
                    .start(() => (mainState.blackStatusBar = true));
            } else {
                Animated.timing(this.composeAnimated, { toValue: this.height, duration: 300 }).start();
                mainState.blackStatusBar = false;
            }
        }, true);
    }

    componentWillUnmount() {
        this.indexAnimation();
        console.log('layout-main.js: unmounted');
    }


    page(control, key) {
        const menuLeft = 0;
        const s = {
            backgroundColor: '#fff',
            position: 'absolute',
            left: key * this.width + menuLeft,
            right: -(key) * this.width - menuLeft,
            bottom: 0,
            top: 0
        };
        return (
            <View style={s} key={key}>
                {control}
            </View>
        );
    }

    pages(controls) {
        return controls.map((item, index) => this.page(item, index));
    }

    body() {
        const r = mainState.route;
        if (routes[r]) {
            return routes[r];
        }
        return [];
    }

    render() {
        const transform = [{ translateX: this.animatedX }];
        const transformMenu = [
            { translateX: mainState.animatedLeftMenu },
            { translateX: mainState.animatedLeftMenuWidth }
        ];
        const transformAndroid = global.platform === 'android' ? [{ translateY: state.keyboardHeight }] : [];
        const outerStyle = {
            backgroundColor: 'white',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: state.keyboardHeight
        };
        const transformCompose = [{ translateY: this.composeAnimated || 0 }];
        const composeStyle = {
            transform: transformCompose,
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };
        // const body = mainState.currentChat ? <Chat ref={c => (this.chatControl = c)} /> : <Placeholder />;
        const title = mainState.title;
        const menuState = mainState.isLeftMenuVisible || mainState.isRightMenuVisible;

        return (
            <View
                style={[styles.container.root, { transform: transformAndroid }]}>
                <TouchableWithoutFeedback
                    onPress={menuState ? () => mainState.resetMenus() : null}>
                    <Animated.View
                        pointerEvents={menuState ? 'box-only' : null}
                        {...this.panResponder.panHandlers}
                        style={outerStyle}>
                        <Animated.View style={{ flex: 1, transform: transformMenu }}>
                            <HeaderMain title={title} />
                            <Animated.View style={{ flex: 1, transform }}>
                                <View style={{ flex: 1 }}>
                                    {this.pages(this.body())}
                                </View>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>
                </TouchableWithoutFeedback>
                <LeftMenu />
                <RightMenu />
                <Animated.View style={composeStyle}>
                    <ComposeMessage />
                </Animated.View>
                <StatusBar barStyle={mainState.blackStatusBar ? 'default' : 'light-content'}
                           hidden={menuState && !mainState.showCompose}
                           // TODO: set show hide animation to 'fade' and 'slide'
                />
            </View>
        );
    }
}

LayoutMain.propTypes = {
    body: React.PropTypes.any,
    footer: React.PropTypes.any
};
