import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from '../layout/popup-layout';
import { vars } from '../../styles/styles';
import { popupFilePreview } from '../shared/popups';
import { tx } from '../utils/translator';

@observer
export default class MockImagePreview extends Component {
    async componentDidMount() {
        const result = await popupFilePreview(
            true,
            {
                0: {
                    iconType: 'img',
                    name: 'testFile'
                }
            },
        );
        console.log(result);
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
