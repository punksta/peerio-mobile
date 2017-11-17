import React from 'react';
import { Text, WebView, View } from 'react-native';
import { observable } from 'mobx';
import { t, tu, tx } from '../utils/translator';
import TextInputStateful from '../controls/text-input-stateful';
import popupState from '../layout/popup-state';
import locales from '../../lib/locales';
import CheckBox from './checkbox';
import { vars } from '../../styles/styles';

function textControl(str) {
    const text = {
        color: '#000000AA',
        marginVertical: vars.spacing.small.maxi,
        lineHeight: 22
    };

    let formatted = str;
    if (typeof str === 'string') {
        formatted = str.replace('\n', '\n\n');
    }

    return <Text style={text}>{formatted}</Text>;
}

function checkBoxControl(str, checked, press) {
    return <CheckBox text={str} isChecked={checked} onChange={press} />;
}

function inputControl(state, placeholder) {
    return (
        <TextInputStateful placeholder={placeholder} state={state} />
    );
}

const swActions = {};

/**
 * Hook action to a system warning action type
 * @param {string} type
 * @param {func} action
 */
function addSystemWarningAction(type, action) {
    swActions[type] = action;
}

function popupSystemWarning(title, contents, buttons) {
    const button = (text, action) => ({ id: 'ok', text, action });
    const swButton = i => ({ id: i.action, text: t(i.label), action: swActions[i.action] });
    return new Promise((resolve) => {
        popupState.showPopup({
            title,
            type: 'systemWarning',
            contents: textControl(contents),
            buttons: buttons ?
                buttons.map(i => (i.action ? swButton(i) : button(i, resolve)))
                : [button(tu('button_ok'), resolve)]
        });
    });
}

function popupYes(title, subTitle, text) {
    return new Promise((resolve) => {
        popupState.showPopup({
            title,
            subTitle: subTitle ? textControl(subTitle) : null,
            contents: text ? textControl(text) : null,
            buttons: [{
                id: 'ok', text: tu('button_ok'), action: resolve
            }]
        });
    });
}

function popupUpgrade(title, subTitle, text) {
    // TODO: add upgrade button
    return popupYes(title, subTitle, text);
}

function popupYesCancel(title, subTitle, text) {
    return new Promise((resolve) => {
        popupState.showPopup({
            title,
            subTitle: textControl(subTitle),
            contents: text ? textControl(text) : null,
            buttons: [
                { id: 'no', text: t('button_no'), action: () => resolve(false), secondary: true },
                { id: 'yes', text: t('button_yes'), action: () => resolve(true) }
            ]
        });
    });
}

function popupYesSkip(title, subTitle, text) {
    return new Promise((resolve) => {
        popupState.showPopup({
            title,
            subTitle: textControl(subTitle),
            contents: textControl(text),
            buttons: [
                { id: 'no', text: t('button_skip'), action: () => resolve(false), secondary: true },
                { id: 'yes', text: t('button_yes'), action: () => resolve(true) }
            ]
        });
    });
}

function popupSignOutAutologin() {
    return new Promise((resolve) => {
        popupState.showPopup({
            title: t('title_gotYourKeys'),
            contents: textControl(t('title_signOutConfirmKeys')),
            buttons: [
                { id: 'no', text: tu('button_getKey'), action: () => resolve(false) },
                { id: 'yes', text: tu('button_lock'), action: () => resolve(true), secondary: true }
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
            { id: 'cancel', text: tu('button_close'), action: () => resolve(false) },
            { id: 'copy', text: tu('title_copy'), action: () => resolve(true) }
        ]
    }));
}

function popupCancelConfirm(title, subTitle, text) {
    return popupState.showPopupPromise(resolve => ({
        title,
        subTitle: textControl(subTitle),
        contents: textControl(text),
        buttons: [
            { id: 'cancel', text: tu('button_cancel'), secondary: true, action: () => resolve(false) },
            { id: 'confirm', text: tu('button_confirm'), action: () => resolve(true) }
        ]
    }));
}

function popupInput(title, subTitle, value) {
    return new Promise((resolve) => {
        const o = observable({ value });
        popupState.showPopup({
            title,
            subTitle: textControl(subTitle),
            contents: inputControl(o),
            buttons: [{
                id: 'ok', text: tu('button_ok'), action: () => resolve(o.value)
            }]
        });
    });
}

function popupInputCancel(title, placeholder, cancelable) {
    return new Promise((resolve) => {
        const o = observable({ value: '' });
        const buttons = [];
        cancelable && buttons.push({
            id: 'cancel', text: tu('button_cancel'), action: () => resolve(false), secondary: true
        });
        buttons.push({
            id: 'ok', text: tu('button_ok'), action: () => resolve(o), get disabled() { return !o.value; }
        });
        const contents = (
            <View>
                {inputControl(o, placeholder)}
            </View>
        );
        popupState.showPopup({
            title,
            contents,
            buttons
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
                id: 'ok', text: tu('button_ok'), action: resolve
            }]
        });
    });
}

function popup2FA(title, placeholder, checkBoxText, checked, cancelable) {
    const helperTextStyle = {
        color: vars.subtleText,
        fontSize: vars.font.size.smaller,
        fontWeight: vars.font.weight.regular,
        paddingVertical: vars.spacing.small.midi
    };
    return new Promise((resolve) => {
        const o = observable({ value: '', checked });
        const buttons = [];
        cancelable && buttons.push({
            id: 'cancel', text: tu('button_cancel'), action: () => resolve(false), secondary: true
        });
        buttons.push({
            id: 'ok', text: tu('button_submit'), action: () => resolve(o), get disabled() { return !o.value; }
        });
        const contents = (
            <View style={{ minHeight: vars.popupMinHeight }}>
                {inputControl(o, placeholder)}
                <Text style={helperTextStyle}>
                    {tx('title_2FAHelperText')}
                </Text>
                {checkBoxText && checkBoxControl(checkBoxText, o.checked, v => { o.checked = v; })}
            </View>
        );
        popupState.showPopup({
            title,
            contents,
            buttons
        });
    });
}

function popupDeleteAccount() {
    const checked = false;
    return popupState.showPopupPromise(resolve => ({
        title: textControl(tx('title_accountDelete')),
        contents: (
            <View>
                {textControl(tx('title_accountDeleteDescription1'))}
                {textControl(tx('title_accountDeleteDescription2'))}
                {textControl(tx('title_accountDeleteDescription3'))}
                {/* checkBoxControl(tx('title_accountDeleteAllFiles'), checked, value => {
                    checked = value;
                    console.log(checked);
                }) */}
            </View>
        ),
        buttons: [
            { id: 'cancel', text: tu('button_cancel'), action: () => resolve(false), secondary: true },
            { id: 'copy', text: tu('button_confirm'), action: () => resolve(true, checked) }
        ]
    }));
}

function popupControl(contents) {
    console.log(`popups.js: popup control`);
    return new Promise((resolve) => {
        popupState.showPopup({
            fullScreen: 1,
            contents,
            buttons: [{
                id: 'ok', text: tu('button_ok'), action: resolve
            }]
        });
    });
}

locales.loadAssetFile('terms.txt').then(s => {
    tos = s;
});


export {
    addSystemWarningAction,
    popupYes,
    popupYesCancel,
    popupYesSkip,
    popupInput,
    popupTOS,
    popup2FA,
    popupCopyCancel,
    popupInputCancel,
    popupUpgrade,
    popupSystemWarning,
    popupDeleteAccount,
    popupControl,
    popupSignOutAutologin,
    popupCancelConfirm
};
