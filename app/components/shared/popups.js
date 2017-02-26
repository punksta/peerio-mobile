import React from 'react';
import {
    Text, WebView
} from 'react-native';
import { observable } from 'mobx';
import TextInputStateful from '../controls/text-input-stateful';
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

function inputControl(state) {
    return (
        <TextInputStateful state={state} />
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

function popupCopyCancel(title, subTitle, text) {
    return popupState.showPopupPromise(resolve => ({
        title,
        subTitle: textControl(subTitle),
        contents: textControl(text),
        buttons: [
            { id: 'cancel', text: 'Cancel', action: () => resolve(false), secondary: true },
            { id: 'copy', text: 'Copy', action: () => resolve(true) }
        ]
    }));
}

function popupInput(title, value) {
    return new Promise((resolve) => {
        const o = observable({ value });
        popupState.showPopup({
            title,
            contents: inputControl(o),
            buttons: [{
                id: 'ok', text: 'OK', action: () => resolve(o.value)
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

module.exports = { popupYes, popupInput, popupTOS, popupCopyCancel };
