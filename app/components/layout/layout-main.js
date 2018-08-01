import React from 'react';
import { observer } from 'mobx-react/native';
import { View, StatusBar } from 'react-native';
import { reaction, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import uiState from './ui-state';
import InputMainContainer from './input-main-container';
import Bottom from '../controls/bottom';
import HeaderMain from './header-main';
import TabContainer from './tab-container';
import SnackBar from '../snackbars/snackbar';
import SnackBarConnection from '../snackbars/snackbar-connection';
import ProgressOverlay from '../shared/progress-overlay';
import { common } from '../../styles/styles';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';
import CustomOverlay from './custom-overlay';

const testBeacon = {
    width: 64,
    height: 64,
    borderWidth: 10,
    borderRadius: 32,
    borderColor: 'red',
    transform: [{ translateY: -40 }, { translateX: -40 }]
};

const testBeaconContainer = {
    position: 'absolute'
};

const testBeaconBg = {
    width: 200,
    height: 50,
    backgroundColor: 'red'
};

@observer
export default class LayoutMain extends SafeComponent {
    @observable modalVisible = false;

    componentDidMount() {
        reaction(() => uiState.appState, () => this.forceUpdate());
    }

    get snackBar() {
        return !this.modal && !routerMain.currentComponent.suppressMainSnackBar ?
            <SnackBar ref={sb => { this._snackBar = sb; }} /> : null;
    }

    renderThrow() {
        const outerStyle = {
            backgroundColor: '#fff',
            flex: 1,
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: global.platform === 'android' ? 0 : uiState.keyboardHeight
        };

        const { pages, currentComponent } = routerMain;
        const currentPage = pages[routerMain.currentIndex];
        const { actionsBar, showInput, leftIcon, rightIcon, layoutTitle } = currentComponent;

        const animatedBlock = (
            <View
                style={outerStyle}>
                <HeaderMain leftIcon={leftIcon} rightIcon={rightIcon} title={layoutTitle} />
                <SnackBarConnection />
                <View
                    style={{ flex: 1, flexGrow: 1 }}>
                    {currentPage}
                    <Bottom>
                        <CustomOverlay />
                        {this.snackBar}
                    </Bottom>
                </View>
                {showInput && <InputMainContainer />}
                {actionsBar || <TabContainer />}
            </View>
        );
        const { beaconCoords } = uiState;
        return (
            <View
                testID="mainLayout"
                style={[common.container.root]}>
                {animatedBlock}
                {uiState.beaconCoords
                    && (
                        <View style={[testBeaconContainer, { left: beaconCoords.x - 100, top: beaconCoords.y - 100 }]}>
                            <View style={testBeaconBg} />
                            <View style={[testBeacon]}>
                                <View style={{ borderRadius: 22, backgroundColor: 'white', width: 44, height: 44 }} />
                            </View>
                        </View>
                    )
                }
                <ProgressOverlay enabled={routerMain.loading} />
                <StatusBar
                    barStyle={uiState.externalViewer || routerModal.isBlackStatusBar ? 'default' : 'light-content'}
                    hidden={false} />
            </View>
        );
    }
}
