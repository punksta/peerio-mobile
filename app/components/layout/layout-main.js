import React, { Component } from 'react';
import {
    View,
    StatusBar,
    Animated,
    TouchableWithoutFeedback,
    Platform,
    Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import { reaction, observable } from 'mobx';
import state from './state';
import InputMainContainer from './input-main-container';
import mainState from '../main/main-state';
import Bottom from '../controls/bottom';
import LeftMenu from '../main/left-menu';
import RightMenu from '../main/right-menu';
import HeaderMain from './header-main';
import Chat from '../messaging/chat';
import Files from '../files/files';
import FileView from '../files/file-view';
import ComposeMessage from '../messaging/compose-message';
import SelectFiles from '../files/select-files';
import FileShare from '../files/file-share';
import SnackBar from '../snackbars/snackbar';
import Fab from '../shared/fab';
// import Placeholder from './placeholder';
import MessagingPlaceholder from '../messaging/messaging-placeholder';
import styles, { vars } from '../../styles/styles';

const routes = {
    recent: [<MessagingPlaceholder />],
    files: [<Files />, <FileView />],
    chat: [<Chat />]
};

const modalRoutes = {
    compose: <ComposeMessage />,
    shareFileTo: <FileShare />,
    selectFiles: <SelectFiles />
};

@observer
export default class LayoutMain extends Component {
    @observable modalRoute = null;

    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
        this.animatedX = new Animated.Value(0);
        this.leftMenuAnimated = new Animated.Value(0);
        this.modalAnimated = new Animated.Value(this.height);
        this.indexAnimation = reaction(() => mainState.currentIndex, i => {
            console.log('layout-main.js: index animation');
            const toValue = -i * this.width;
            const duration = mainState.suppressTransition ? 0 : vars.animationDuration;
            Animated.timing(this.animatedX, { toValue, duration })
                .start();
        }, true);
        this.leftMenuAnimation = reaction(() => mainState.isLeftMenuVisible, v => {
            const toValue = v ? this.width * vars.menuWidthRatio : 0;
            Animated.timing(this.leftMenuAnimated, { toValue, duration: vars.animationDuration })
                .start();
        }, true);
    }

    componentWillMount() {
        mainState.initial();
    }

    componentDidMount() {
        reaction(() => mainState.modalRoute, route => {
            if (route) {
                this.modalRoute = route;
                Animated.timing(
                    this.modalAnimated, { toValue: 0, duration: 300 }
                ).start(() => (mainState.blackStatusBar = true));
            } else {
                Animated.timing(
                    this.modalAnimated, { toValue: this.height, duration: 300 }
                ).start(() => (this.modalRoute = route));
                mainState.blackStatusBar = false;
            }
        }, true);

        reaction(() => state.appState, () => this.forceUpdate());
    }

    componentWillUnmount() {
        this.indexAnimation();
        console.log('layout-main.js: unmounted');
    }

    page(control, key) {
        const s = {
            backgroundColor: '#fff',
            position: 'absolute',
            left: key * this.width,
            width: this.width,
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

    modal() {
        return modalRoutes[this.modalRoute] || null;
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
            backgroundColor: '#fff',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: state.keyboardHeight
        };
        const transformModal = [{ translateY: this.modalAnimated || 0 }];
        const composeStyle = {
            transform: transformModal,
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };
        const title = mainState.title;
        const menuState = mainState.isLeftMenuVisible || mainState.isRightMenuVisible;
        const pages = this.body();
        const currentPage = pages[mainState.currentIndex] || {};
        const currentComponent = currentPage.type && currentPage.type.prototype || {};
        const snackBar = !menuState &&
            !mainState.modalRoute && !currentComponent.suppressMainSnackBar && <SnackBar />;

        const width = this.width * pages.length;

        return (
            <View
                testID="mainLayout"
                style={[styles.container.root, { transform: transformAndroid }]}>
                <TouchableWithoutFeedback
                    onPress={menuState ? () => mainState.resetMenus() : null}>
                    <Animated.View
                        style={outerStyle}>
                        <Animated.View style={{ flex: 1, transform: transformMenu }}>
                            <HeaderMain title={title} />
                            <Animated.View style={{ flex: 1, transform, width }}>
                                <View style={{ flex: 1, width }}>
                                    {this.pages(pages)}
                                </View>
                            </Animated.View>
                            <Bottom>
                                {currentComponent.isFabVisible && <Fab />}
                                {snackBar}
                            </Bottom>
                            { currentComponent.showInput && <InputMainContainer /> }
                        </Animated.View>
                    </Animated.View>
                </TouchableWithoutFeedback>
                <LeftMenu />
                <RightMenu />
                <Animated.View style={composeStyle}>
                    {this.modal()}
                </Animated.View>
                <StatusBar barStyle={mainState.blackStatusBar ? 'default' : 'light-content'}
                           hidden={Platform.OS !== 'android' && menuState && !mainState.modalRoute}
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
