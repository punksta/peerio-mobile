import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
// import fileState from '../files/file-state';
import PopupLayout from '../layout/popup-layout';
import FileSharePreview from '../files/file-share-preview';
import { tx } from '../utils/translator';

@observer
export default class MockImagePreview extends Component {
    componentWillMount() {
        const file = observable({
            tmpCached: true,
            fileId: '0FSkYEbEq64lCHMdpb1MrndOQFOes3uNAOwg2qqfXRbt5MUQIcTmnDMO',
            tmpCachePath: '/Users/seavan/Library/Developer/CoreSimulator/Devices/BEEBFAB7-125B-469D-923B-AAF5EB5E47D5/data/Containers/Data/Application/4179624A-72E0-4C96-A8B1-E5DFF678B86F/Library/Caches/cache/d73b44ad8eea613e8a5d55aebc04d3fc.jpg',
            name: 'IMG_0001.jpg'
        });
        FileSharePreview.popup(file);
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                <PopupLayout />
                { /* <StatusBar barStyle="default" /> */}
            </View>
        );
    }
}
