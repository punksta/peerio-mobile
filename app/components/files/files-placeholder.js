import React, { Component } from 'react';
import {
    View, ActivityIndicator, Text, Dimensions, Image
} from 'react-native';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';

const fileUploadZeroState = require('../../assets/file-upload-zero-state.png');
const arrowDownZeroState = require('../../assets/arrow-down-zero-state.png');

@observer
export default class FilesPlaceholder extends Component {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
    }

    messaging() {
        const headerStyle = {
            textAlign: 'center',
            fontSize: 20
        };
        const infoStyle = {
            textAlign: 'center',
            fontSize: 16
        };
        const outerContainerStyle = {
            flex: 1,
            alignItems: 'center'
        };
        const imageStyle = {
            flex: 1,
            width: null,
            borderWidth: 0,
            borderColor: 'blue',
            height: null
        };
        const titleBlockStyle = {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            borderWidth: 0,
            borderColor: 'yellow',
            paddingRight: 25,
            paddingBottom: 75

        };
        return (
            <View style={outerContainerStyle}>
                <View style={{ flex: 1,
                      width: this.width,
                      justifyContent: 'center' }}>
                    <View style={{ flex: 0, alignItems: 'center', marginTop: 40 }}>
                        <Text style={infoStyle}>Upload, share and manage</Text>
                    </View>
                    <View style={{ borderColor: 'red', borderWidth: 0, flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                        <Image source={fileUploadZeroState}
                               resizeMode="contain"
                               style={{ flex: 1, width: null, height: null }} />
                    </View>
                    <View style={{ flex: 0.5 }}>
                        <Text style={headerStyle}>Upload something.</Text>
                        <View style={titleBlockStyle}>
                            <View style={{ flex: 1, flexGrow: 0.5, borderWidth: 0, borderColor: 'red' }} />
                            <View style={{ flex: 1, borderWidth: 0, borderColor: 'green', justifyContent: 'flex-end' }}>
                                <Image source={arrowDownZeroState}
                                       resizeMode="contain"
                                       style={imageStyle} />
                            </View>
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
