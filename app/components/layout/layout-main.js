import React, { Component } from 'react';
import {
    View,
    StatusBar,
    Animated,
    Platform,
    Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import { reaction, observable } from 'mobx';
import uiState from './ui-state';
import InputMainContainer from './input-main-container';
import Bottom from '../controls/bottom';
import HeaderMain from './header-main';
import Tabs from './tabs';
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
        const outerStyle = {
            backgroundColor: '#fff',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: global.platform === 'android' ? 0 : uiState.keyboardHeight
        };

        const pages = routerMain.pages;
        const currentPage = pages[routerMain.currentIndex];
        const currentComponent = routerMain.currentComponent;
        const snackBar =
            !this.modal && !currentComponent.suppressMainSnackBar && <SnackBar />;

        const width = this.width * pages.length;
        const animatedBlock = (
            <Animated.View
                style={outerStyle}>
                <View style={{ flex: 1 }}>
                    <HeaderMain />
                    <SnackBarConnection />
                    <View style={{ flex: 1 }}>
                        {currentPage}
                    </View>
                    {currentComponent.showInput && <InputMainContainer />}
                    <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                        {currentComponent.isFabVisible && <Fab />}
                    </View>
                    <Bottom>
                        {snackBar}
                    </Bottom>
                    <Tabs />
                </View>
            </Animated.View>
        );
        return (
            <View
                testID="mainLayout"
                style={[styles.container.root]}>
                {animatedBlock}
                <StatusBar
                    barStyle={routerModal.isBlackStatusBar ? 'default' : 'light-content'}
                    hidden={false} />
            </View>
        );
    }
}
