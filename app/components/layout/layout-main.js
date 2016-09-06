import React, { Component } from 'react';
import {
    Text,
    TextInput,
    LayoutAnimation,
    View,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer } from 'mobx-react/native';
import state from './state';
import HeaderMain from './header-main';
import InputMain from './input-main';
import TextIpsum from './text-ipsum';
import styles from '../../styles/styles';

@observer
export default class LayoutMain extends Component {
    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }
    render() {
        const leftMenuWidth = state.isLeftMenuVisible ? 200 : 0;
        const rightMenuWidth = state.isRightMenuVisible ? 200 : 0;
        return (
            <View style={styles.container.root}>
                <HeaderMain />
                <KeyboardAvoidingView behavior="padding" style={{
                    backgroundColor: 'white',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
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
                </KeyboardAvoidingView>
                <View style={{
                    position: 'absolute',
                    paddingTop: 30,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: leftMenuWidth,
                    backgroundColor: '#FFFFFF40' }}>
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
                    backgroundColor: '#FFFFFF40' }}>
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
