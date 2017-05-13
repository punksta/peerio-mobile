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
import ProgressOverlay from '../shared/progress-overlay';
// import snackbarState from '../snackbars/snackbar-state';
import Fab from '../shared/fab';
import { common } from '../../styles/styles';
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
        const style = {
            position: 'absolute',
            right: 0,
            bottom: this.isFabVisible ? 0 : -height,
            paddingBottom: this._snackBar ? this._snackBar.animatedHeight : 0
        };
        return (
            <Animated.View style={style}>
                <Fab />
            </Animated.View>
        );
    }

    get snackBar() {
        return !this.modal && !routerMain.currentComponent.suppressMainSnackBar ?
            <SnackBar ref={sb => (this._snackBar = sb)} /> : null;
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
        const { actionsBar, showInput } = currentComponent;

        const animatedBlock = (
            <Animated.View
                style={outerStyle}>
                <View style={{ flex: 1, flexGrow: 1 }}>
                    <HeaderMain />
                    <SnackBarConnection />
                    <View style={{ flex: 1, flexGrow: 1 }}>
                        {currentPage}
                        <Bottom>
                            {this.snackBar}
                        </Bottom>
                    </View>
                    {showInput && <InputMainContainer />}
                    {this.fab}
                    { actionsBar || <Tabs />}
                </View>
            </Animated.View>
        );
        return (
            <View
                testID="mainLayout"
                style={[common.container.root]}>
                {animatedBlock}
                <ProgressOverlay enabled={routerMain.loading} />
                <StatusBar
                    barStyle={uiState.externalViewer || routerModal.isBlackStatusBar ? 'default' : 'light-content'}
                    hidden={false} />
            </View>
        );
    }
}
