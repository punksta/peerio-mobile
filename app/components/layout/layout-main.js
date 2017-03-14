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
import uiState from './ui-state';
import InputMainContainer from './input-main-container';
import Bottom from '../controls/bottom';
import LeftMenu from '../main/left-menu';
import RightMenu from '../main/right-menu';
import HeaderMain from './header-main';
import SnackBar from '../snackbars/snackbar';

import Fab from '../shared/fab';
import styles, { vars } from '../../styles/styles';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';

@observer
export default class LayoutMain extends Component {
    @observable modal = null;

    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
        this.animatedX = new Animated.Value(0);
        this.leftMenuAnimated = new Animated.Value(0);
        this.modalAnimated = new Animated.Value(this.height);
        this.indexAnimation = reaction(() => routerMain.currentIndex, i => {
            console.log('layout-main.js: index animation');
            const toValue = -i * this.width;
            const duration = routerMain.suppressTransition ? 0 : vars.animationDuration;
            routerMain.suppressTransition = false;
            Animated.timing(this.animatedX, { toValue, duration })
                .start();
        }, true);
        this.leftMenuAnimation = reaction(() => routerMain.isLeftMenuVisible, v => {
            const toValue = v ? this.width * vars.menuWidthRatio : 0;
            Animated.timing(this.leftMenuAnimated, { toValue, duration: vars.animationDuration })
                .start();
        }, true);
    }

    componentDidMount() {
        reaction(() => routerModal.modal, modal => {
            const duration = vars.animationDuration;
            if (modal) {
                this.modal = modal;
                Animated.timing(this.modalAnimated, { toValue: 0, duration })
                    .start(() => (routerMain.blackStatusBar = true));
            } else {
                Animated.timing(this.modalAnimated, { toValue: this.height, duration })
                    .start(() => (this.modal = null));
                routerMain.blackStatusBar = false;
            }
        }, true);
        reaction(() => uiState.appState, () => this.forceUpdate());
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

    render() {
        const transform = [{ translateX: this.animatedX }];
        const transformMenu = [
            { translateX: routerMain.animatedLeftMenu },
            { translateX: routerMain.animatedLeftMenuWidth }
        ];
        const outerStyle = {
            backgroundColor: '#fff',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: global.platform === 'android' ? 0 : uiState.keyboardHeight
        };
        const transformModal = [{ translateY: this.modalAnimated || 0 }];

        const modalStyle = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };

        const modalAnimatedStyle = [modalStyle, { transform: transformModal }];
        const modalControl = routerModal.modalControl;
        const modalNonAnimatedStyle = [modalStyle, {
            transform: [{ translateY: modalControl ? 0 : this.height }]
        }];

        const menuState = routerMain.isLeftMenuVisible || routerMain.isRightMenuVisible;
        const pages = routerMain.pages;
        const currentComponent = routerMain.currentComponent;
        const snackBar = !menuState &&
            !this.modal && !currentComponent.suppressMainSnackBar && <SnackBar />;

        const width = this.width * pages.length;
        return (
            <View
                testID="mainLayout"
                style={[styles.container.root]}>
                <TouchableWithoutFeedback
                    onPress={menuState ? () => routerMain.resetMenus() : null}>
                    <Animated.View
                        pointerEvents={menuState ? 'box-only' : 'auto'}
                        style={outerStyle}>
                        <Animated.View style={{ flex: 1, transform: transformMenu }}>
                            <HeaderMain title={routerMain.title} />
                            <Animated.View style={{ flex: 1, transform, width }}>
                                <View style={{ flex: 1, width }}>
                                    {this.pages(pages)}
                                </View>
                            </Animated.View>
                            <Bottom>
                                {currentComponent.isFabVisible && <Fab />}
                                {snackBar}
                            </Bottom>
                            {currentComponent.showInput && <InputMainContainer />}
                        </Animated.View>
                    </Animated.View>
                </TouchableWithoutFeedback>
                <LeftMenu />
                <RightMenu />
                <Animated.View style={modalAnimatedStyle}>
                    {this.modal}
                </Animated.View>
                <View style={modalNonAnimatedStyle}>
                    {modalControl}
                </View>
                <StatusBar barStyle={routerMain.blackStatusBar ? 'default' : 'light-content'}
                           hidden={Platform.OS !== 'android' && menuState && !this.modal} />
            </View>
        );
    }
}
