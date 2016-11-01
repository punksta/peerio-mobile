import React, { Component } from 'react';
import {
    View,
    ScrollView,
    PanResponder,
    LayoutAnimation,
    Animated,
    Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import { reaction } from 'mobx';
import state from './state';
import mainState from '../main/main-state';
import LeftMenu from '../main/left-menu';
import RightMenu from '../main/right-menu';
import HeaderMain from './header-main';
// import TextIpsum from './text-ipsum';
import RecentList from '../main/recent-list';
import Chat from '../messaging/chat';
import styles from '../../styles/styles';

// const routes = ({
//     recent: () => <RecentList />,
//     chat: () => <Chat />
// });

@observer
export default class LayoutMain extends Component {
    constructor(props) {
        super(props);
        this.hideMenus = this.hideMenus.bind(this);
        this.width = Dimensions.get('window').width;
        this.currentIndex = 0;
        this.animatedX = new Animated.Value(0);
        this.indexAnimation = reaction(() => mainState.currentIndex, i => {
            console.log('index animation');
            const toValue = -i * this.width;
            Animated.timing(this.animatedX, { toValue, duration: 300 })
                .start(() => {
                    this.currentIndex = i;
                });
        });
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

    componentDidMount() {
        console.log('mounted');
    }

    componentWillUnmount() {
        this.indexAnimation();
        console.log('unmounted');
    }


    componentWillUpdate() {
        // LayoutAnimation.easeInEaseOut();
    }

    hideMenus() {
        mainState.isLeftMenuVisible = false;
        mainState.isRightMenuVisible = false;
    }

    page(control, key) {
        const menuLeft = mainState.isLeftMenuVisible ? this.width * 0.8 : 0;
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

    render() {
        const transform = [{ translateX: this.animatedX }];
        const transformOuter = [{ translateX: this.leftMenuAnimated || 0 }];
        return (
            <View style={styles.container.root}>
                <HeaderMain />
                <Animated.View
                    {...this.panResponder.panHandlers}
                    behavior="padding"
                    style={{
                        transform: transformOuter,
                        backgroundColor: 'white',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        paddingBottom: state.keyboardHeight
                    }}>
                    <Animated.View style={{ flex: 1, transform }}>
                        { this.pages([<RecentList />, <Chat />]) }
                    </Animated.View>
                </Animated.View>
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
