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
import SnackBarConnection from '../snackbars/snackbar-connection';
import Fab from '../shared/fab';
import styles, { vars } from '../../styles/styles';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';

@observer
export default class LayoutMain extends Component {
    @observable modalVisible = false;

    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
        this.animatedX = new Animated.Value(0);
        this.indexAnimation = reaction(() => routerMain.currentIndex, i => {
            console.log('layout-main.js: index animation');
            const toValue = -i * this.width;
            const duration = routerMain.suppressTransition ? 0 : vars.animationDuration;
            routerMain.suppressTransition = false;
            Animated.timing(this.animatedX, { toValue, duration })
                .start();
        }, true);
    }

    componentDidMount() {
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

        const menuState = routerMain.isLeftMenuVisible || routerMain.isRightMenuVisible;
        const pages = routerMain.pages;
        const currentComponent = routerMain.currentComponent;
        const snackBar = !menuState &&
            !this.modal && !currentComponent.suppressMainSnackBar && <SnackBar />;

        const width = this.width * pages.length;
        const animatedBlock = (
            <Animated.View
                pointerEvents={menuState ? 'box-only' : 'auto'}
                style={outerStyle}>
                <Animated.View style={{ flex: 1, transform: transformMenu }}>
                    <HeaderMain title={routerMain.title} />
                    <SnackBarConnection />
                    <Animated.View style={{ flex: 1, transform, width }}>
                        <View style={{ flex: 1, width }}>
                            {this.pages(pages)}
                        </View>
                        {currentComponent.showInput && <InputMainContainer />}
                    </Animated.View>
                    <Bottom>
                        {currentComponent.isFabVisible && <Fab />}
                        {snackBar}
                    </Bottom>
                </Animated.View>
            </Animated.View>
        );
        const tapHider = menuState && (
            <TouchableWithoutFeedback
                onPress={() => routerMain.resetMenus()}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
            </TouchableWithoutFeedback>
         );
        return (
            <View
                testID="mainLayout"
                style={[styles.container.root]}>
                {animatedBlock}
                {tapHider}
                <LeftMenu />
                <RightMenu />
                <StatusBar
                    barStyle={routerModal.isBlackStatusBar ? 'default' : 'light-content'}
                    hidden={Platform.OS !== 'android' && menuState && !routerModal.modal} />
            </View>
        );
    }
}
