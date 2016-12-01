import { Keyboard } from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import _ from 'lodash';
import moment from 'moment';
import { observable, action, reaction, autorun } from 'mobx';
import translator from 'peerio-translator';
import locales from '../../lib/locales';
import store from '../../store/local-storage';

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
    languages: {
        en: 'English',
        fr: 'French',
        es: 'Spanish',
        ru: 'Russian'
    },
    modals: [],

    get bottomOffset() {
        const pickerHeight = this.pickerVisible ? this.pickerHeight : 0;
        return this.keyboardHeight || pickerHeight;
    },

    @action focusTextBox(textbox) {
        state.focusedTextBox = textbox;
    },

    @action showPicker(picker) {
        state.hideKeyboard();
        state.picker = picker;
        setTimeout(() => { state.pickerVisible = true; }, 0);
    },

    @action hidePicker(/* picker */) {
        state.hideKeyboard();
    },

    @action hideKeyboard() {
        if (state.focusedTextBox) {
            state.focusedTextBox.blur();
            state.focusedTextBox = null;
        }
        dismissKeyboard();
        setTimeout(() => { state.pickerVisible = false; }, 0);
    },

    @action hideAll() {
        this.hideKeyboard();
        this.hidePicker();
    },

    @action setLocale(lc) {
        return locales.loadLocaleFile(lc)
            .then(locale => {
                // console.log(locale);
                translator.setLocale(lc, locale);
                state.locale = lc;
                state.languageSelected = lc;
                this.save();
                moment.locale(lc);
            });
    },

    @action async load() {
        const s = await store.system.get('state');
        let locale = 'en';
        if (s) {
            locale = s.locale;
        }
        this.setLocale(locale);
    },

    @action async save() {
        const locale = this.locale || 'en';
        await store.system.set('state', { locale });
    }
});

reaction(() => state.languageSelected, ls => state.setLocale(ls));

autorun(() => {
    const r = state.routes[state.route];
    const pages = [];
    if (r && r.states) {
        _.forOwn(r.states, (val, key) => {
            pages.push(key);
        });
    }
    state.pages = pages;
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
