import React from 'react';
import {
    Text
} from 'react-native';
import mainState from '../main/main-state';

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
        mainState.showPopup({
            title,
            subTitle: textControl(subTitle),
            contents: textControl(text),
            buttons: [{
                id: 'ok', text: 'OK', action: resolve
            }]
        });
    });
}

module.exports = { popupYes };
