import React, { Component } from 'react';
import {
    View, ActivityIndicator, Text, Dimensions, Image
} from 'react-native';
import { observer } from 'mobx-react/native';
import SnackBar from '../snackbars/snackbar';
import mainState from '../main/main-state';

const chatZeroState = require('../../assets/chat-zero-state.png');
const arrowUpZeroState = require('../../assets/arrow-up-zero-state.png');

@observer
export default class MessagingPlaceholder extends Component {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
    }

    messaging() {
        const headerStyle = {
            textAlign: 'center',
            fontSize: 18
        };
        const infoStyle = {
            flex: 1,
            textAlign: 'left',
            fontSize: 16
        };
        const outerContainerStyle = {
            flex: 1,
            alignItems: 'center'
        };
        const imageStyle = {
            flex: 1,
            width: null,
            height: null
        };
        const titleBlockStyle = {
            flex: 0,
            height: 80,
            flexDirection: 'row',
            alignItems: 'flex-end'
        };
        const textHintContainer = {
            flex: 0.3,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 40,
            justifyContent: 'space-between'
        };
        return (
            <View style={outerContainerStyle}>
                <View style={{ flex: 1,
                      width: this.width,
                      justifyContent: 'space-between' }}>
                    <View style={titleBlockStyle}>
                        <View style={{ flex: 1 }}>
                            <Image source={arrowUpZeroState}
                                   resizeMode="contain"
                                   style={imageStyle} />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={headerStyle}>Have a{'\n'}conversation</Text>
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ borderColor: 'red', borderWidth: 0, flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                        <Image source={chatZeroState}
                               resizeMode="contain"
                               style={{ flex: 1, width: null, height: null }} />
                    </View>
                    <View style={textHintContainer}>
                        <View style={{ flex: 1 }}>
                            <Text style={infoStyle}>Direct messages</Text>
                            <Text style={infoStyle}>Multiparty chat</Text>
                            <Text style={infoStyle}>Share files in chat</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const s = {
            flex: 1,
            justifyContent: 'space-between'
        };
        const ind = mainState.loading ?
            <ActivityIndicator style={{ paddingTop: 10 }} /> : this.messaging();
        return (
            <View style={s}>
                {ind}
            </View>
        );
    }
}

