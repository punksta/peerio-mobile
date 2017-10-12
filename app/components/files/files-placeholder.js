import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, Dimensions, Image } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';

const fileUploadZeroState = require('../../assets/file-upload-zero-state.png');
const arrowDownZeroState = require('../../assets/arrow-down-zero-state.png');

@observer
export default class FilesPlaceholder extends SafeComponent {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
    }

    messaging() {
        const headerStyle = {
            textAlign: 'center',
            fontSize: vars.font.size.huge
        };
        const infoStyle = {
            textAlign: 'center',
            fontSize: vars.font.size.bigger
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
                        <Text style={infoStyle}>{tx('title_uploadShareAndManage')}</Text>
                    </View>
                    <View style={{ borderColor: 'red', borderWidth: 0, flex: 1, paddingLeft: vars.spacing.huge, paddingRight: vars.spacing.huge }}>
                        <Image source={fileUploadZeroState}
                               resizeMode="contain"
                               style={{ flex: 1, width: null, height: null }} />
                    </View>
                    <View style={{ flex: 0.5 }}>
                        <Text style={headerStyle}>{tx('title_uploadSomething')}</Text>
                        <View style={titleBlockStyle}>
                            <View style={{ flex: 1, flexGrow: 0.5, borderWidth: 0, borderColor: 'red' }} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderThrow() {
        const s = {
            flex: 1,
            justifyContent: 'space-between'
        };
        return (
            <View style={s}>
                {this.messaging()}
            </View>
        );
    }
}
