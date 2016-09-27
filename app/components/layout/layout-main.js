import React, { Component } from 'react';
import {
    Text,
    TextInput,
    LayoutAnimation,
    View,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
    PanResponder
} from 'react-native';
import { observer } from 'mobx-react/native';
import state from './state';
import HeaderMain from './header-main';
import InputMain from './input-main';
import TextIpsum from './text-ipsum';
import styles from '../../styles/styles';

@observer
export default class LayoutMain extends Component {
    constructor(props) {
        super(props);
        this.hideMenus = this.hideMenus.bind(this);
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                this.hideMenus();
                return false;
            }
        });
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    keyboardWillShow(e) {
        state.keyboardHeight = e.endCoordinates.height;
    }

    keyboardWillHide(e) {
        state.keyboardHeight = 0;
    }

    hideMenus() {
        state.isLeftMenuVisible = false;
        state.isRightMenuVisible = false;
    }
    render() {
        const width = Dimensions.get('window').width;
        const ratio = 0.8;
        const leftMenuWidth = state.isLeftMenuVisible ? width * ratio : 0;
        const rightMenuWidth = state.isRightMenuVisible ? width * ratio : 0;
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
                        <TextIpsum />
                    </ScrollView>
                    <View style={{
                        flex: 0,
                        borderTopColor: '#EFEFEF',
                        borderTopWidth: 2,
                        backgroundColor: '#fff'
                    }}>
                        <InputMain />
                    </View>
                </View>
                <View style={{
                    position: 'absolute',
                    paddingTop: 30,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: leftMenuWidth,
                    backgroundColor: '#FFFFFFA0' }}>
                    <Text>
                        left slide menu
                    </Text>
                </View>
                <View style={{
                    position: 'absolute',
                    paddingTop: 30,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: rightMenuWidth,
                    backgroundColor: '#FFFFFFA0' }}>
                    <Text>
                        right slide menu
                    </Text>
                </View>
            </View>
        );
    }
}

LayoutMain.propTypes = {
    body: React.PropTypes.any,
    footer: React.PropTypes.any
};
