import { Keyboard } from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import _ from 'lodash';
import moment from 'moment';
import { observable, action, reaction } from 'mobx';
import translator from 'peerio-translator';
import locales from '../../lib/locales';
import { TinyDb, PhraseDictionaryCollection } from '../../lib/icebear';

const state = observable({
    isFirstLogin: false,
    route: '',
    prevRoute: '',
    routes: {},
    routesList: [],
    persistentFooter: [],
    pages: [],
    focusedTextBox: null,
    picker: null,
    pickerVisible: false,
    keyboardVisible: false,
    keyboardHeight: 0,
    locale: null,
    pickerHeight: 200,
    languageSelected: 'en',
    appState: 'active',
    languages: {
        en: 'English',
        fr: 'French',
        es: 'Spanish',
        ru: 'Russian'
    },

    get bottomOffset() {
        const pickerHeight = this.pickerVisible ? this.pickerHeight : 0;
        return this.keyboardHeight || pickerHeight;
    },

    focusTextBox: action.bound(function(textbox) {
        this.focusedTextBox = textbox;
    }),

    showPicker: action.bound(function(picker) {
        this.hideKeyboard();
        this.picker = picker;
        setTimeout(() => { this.pickerVisible = true; }, 0);
    }),

    hidePicker: action.bound(function() {
        this.hideKeyboard();
    }),

    hideKeyboard: action.bound(function() {
        dismissKeyboard();
        setTimeout(() => { this.pickerVisible = false; }, 0);
    }),

    hideAll: action.bound(function() {
        this.hideKeyboard();
        this.hidePicker();
    }),

    setLocale: action.bound(function(lc) {
        return locales.loadLocaleFile(lc)
            .then(locale => {
                console.log(`state.js: ${lc}`);
                console.log(lc);
                translator.setLocale(lc, locale);
                this.locale = lc;
                this.languageSelected = lc;
                this.save();
                moment.locale(lc);
            })
            .then(() => locales.loadDictFile(lc))
            .then(dictString => {
                PhraseDictionaryCollection.addDictionary(state.locale, dictString);
                PhraseDictionaryCollection.selectDictionary(state.locale);
            });
    }),

    load: action.bound(function() {
        return TinyDb.system.getValue('state')
            .then(s => this.setLocale(s && s.locale || 'en'));
    }),

    save: action.bound(function() {
        const locale = this.locale || 'en';
        return TinyDb.system.setValue('state', { locale });
    })
});

reaction(() => state.languageSelected, ls => state.setLocale(ls));

reaction(() => state.route, () => {
    const r = state.routes[state.route];
    const pages = [];
    if (r && r.states) {
        _.forOwn(r.states, (val, key) => {
            pages.push(key);
        });
    }
    state.pages = pages;
});

reaction(() => state.focusedTextBox, () => {
    if (state.focusedTextBox) {
        state.pickerVisible = false;
    }
});

Keyboard.addListener('keyboardWillShow', (e) => {
    state.keyboardHeight = e.endCoordinates.height;
});

Keyboard.addListener('keyboardDidShow', (e) => {
    state.keyboardHeight = e.endCoordinates.height;
});

Keyboard.addListener('keyboardWillHide', () => {
    state.keyboardHeight = 0;
});

Keyboard.addListener('keyboardDidHide', () => {
    state.keyboardHeight = 0;
});


export default state;
