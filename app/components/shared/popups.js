import React from 'react';
import {
    Text, ScrollView
} from 'react-native';
import popupState from '../layout/popup-state';

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

function popupTOS() {
    console.log(`popup tos`);
    return new Promise((resolve) => {
        popupState.showPopup({
            title: 'Terms of Use',
            buttons: [{
                id: 'ok', text: 'OK', action: resolve
            }]
        });
    });
}

module.exports = { popupYes, popupTOS };
