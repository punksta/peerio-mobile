import React from 'react';
import {
    Text, WebView
} from 'react-native';
import { observable } from 'mobx';
import { t } from '../utils/translator';
import TextInputStateful from '../controls/text-input-stateful';
import popupState from '../layout/popup-state';
import locales from '../../lib/locales';

function textControl(str) {
    const text = {
        color: '#000000AA',
        marginVertical: 12
    };

    return t && (
        <Text style={text}>{str}</Text>
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
                id: 'ok', text: t('ok'), action: resolve
            }]
        });
    });
}

function popupYesCancel(title, subTitle, text) {
    return new Promise((resolve) => {
        popupState.showPopup({
            title,
            subTitle: textControl(subTitle),
            contents: textControl(text),
            buttons: [
                { id: 'no', text: t('button_no'), action: () => resolve(false), secondary: true },
                { id: 'yes', text: t('button_yes'), action: () => resolve(true) }
            ]
        });
    });
}

function popupCopyCancel(title, subTitle, text) {
    return popupState.showPopupPromise(resolve => ({
        title,
        subTitle: textControl(subTitle),
        contents: textControl(text),
        buttons: [
            { id: 'cancel', text: t('cancel'), action: () => resolve(false), secondary: true },
            { id: 'copy', text: t('button_copy'), action: () => resolve(true) }
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
                id: 'ok', text: t('ok'), action: () => resolve(o.value)
            }]
        });
    });
}

function popupInputCancel(title, value) {
    return new Promise((resolve) => {
        const o = observable({ value });
        popupState.showPopup({
            title,
            contents: inputControl(o),
            buttons: [{
                id: 'cancel', text: t('cancel'), secondary: true
            }, {
                id: 'ok', text: t('ok'), action: () => resolve(o.value)
            }]
        });
    });
}

let tos = '';

function popupTOS() {
    console.log(`popups.js: popup tos`);
    return new Promise((resolve) => {
        popupState.showPopup({
            fullScreen: 1,
            contents: <WebView
            source={{ html: tos }} />,
            buttons: [{
                id: 'ok', text: t('ok'), action: resolve
            }]
        });
    });
}

locales.loadAssetFile('terms.txt').then(s => {
    tos = s;
});

module.exports = { popupYes, popupYesCancel, popupInput, popupTOS, popupCopyCancel, popupInputCancel };
