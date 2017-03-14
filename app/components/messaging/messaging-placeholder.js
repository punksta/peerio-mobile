import React, { Component } from 'react';
import {
    View, Text, Dimensions, Image
} from 'react-native';
import { observer } from 'mobx-react/native';

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
            fontSize: 24
        };
        const infoStyle = {
            flexShrink: 1,
            textAlign: 'left',
            fontSize: 16,
            height: 48
        };
        const outerContainerStyle = {
            flex: 1,
            flexGrow: 1,
            alignItems: 'stretch'
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
                <View style={[titleBlockStyle, { marginTop: 16 }]}>
                    <View style={{ flex: 1, marginLeft: 32 }}>
                        <Image source={arrowUpZeroState}
                            resizeMode="contain"
                            style={imageStyle} />
                    </View>
                    <View style={{ flexGrow: 1, flexShrink: 0, alignItems: 'center', alignSelf: 'center', marginTop: 52, marginLeft: -32 }}>
                        <Text style={headerStyle}>Have a{'\n'}conversation</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
                <View style={{
                    borderColor: 'red',
                    borderWidth: 0,
                    flexGrow: 0,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    paddingLeft: 20,
                    paddingRight: 20,
                    width: 245,
                    height: 232,
                    marginTop: 32
                }}>
                    <Image source={chatZeroState}
                        resizeMode="contain"
                        style={{ flexGrow: 1, width: null, height: null }} />
                </View>
                <View style={textHintContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={infoStyle}>Direct messages</Text>
                        <Text style={infoStyle}>Multiparty chat</Text>
                        <Text style={infoStyle}>Share files in chat</Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const s = {
            flex: 1,
            flexGrow: 1,
            justifyContent: 'space-between'
        };
        return (
            <View style={s}>
                {this.messaging()}
            </View>
        );
    }
}
