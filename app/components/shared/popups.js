import React from 'react';
import {
    Text, ScrollView, WebView
} from 'react-native';
import popupState from '../layout/popup-state';
import locales from '../../lib/locales';

function textControl(t) {
    const text = {
        color: '#000000AA',
        marginVertical: 12
    };

    return (
        <Text style={text}>{t}</Text>
    );
}

function popupYes(title, subTitle, text) {
    return new Promise((resolve) => {
        popupState.showPopup({
            title,
            subTitle: textControl(subTitle),
            contents: textControl(text),
            buttons: [{
                id: 'ok', text: 'OK', action: resolve
            }]
        });
    });
}

let tos = '';

function popupTOS() {
    console.log(`popup tos`);
    return new Promise((resolve) => {
        popupState.showPopup({
            fullScreen: 1,
            contents: <WebView
            source={{ html: tos }} />,
            buttons: [{
                id: 'ok', text: 'OK', action: resolve
            }]
        });
    });
}

locales.loadAssetFile('terms.txt').then(s => {
    tos = s;
});

module.exports = { popupYes, popupTOS };
