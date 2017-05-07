import React, { Component } from 'react';
import { View, StatusBar, Animated, LayoutAnimation, Dimensions } from 'react-native';
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

const { width, height } = Dimensions.get('window');

@observer
export default class LayoutMain extends Component {
    @observable modalVisible = false;

    componentDidMount() {
        reaction(() => uiState.appState, () => this.forceUpdate());
    }

    get isFabVisible() {
        return routerMain.currentComponent && routerMain.currentComponent.isFabVisible;
    }

    get fab() {
        return (
            <View style={{ position: 'absolute', right: 0, bottom: this.isFabVisible ? 0 : -height }}>
                <Fab />
            </View>
        );
    }

    page(control, key) {
        const s = {
            backgroundColor: '#fff',
            position: 'absolute',
            width,
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
                    {this.fab}
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
