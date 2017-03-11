import { Keyboard } from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import _ from 'lodash';
import moment from 'moment';
import { observable, action, reaction } from 'mobx';
import translator from 'peerio-translator';
import locales from '../../lib/locales';
import { TinyDb, PhraseDictionaryCollection } from '../../lib/icebear';

class UIState {
    @observable isFirstLogin = false;
    @observable route = '';
    @observable prevRoute = '';
    @observable routes = {};
    @observable routesList = [];
    @observable pages = [];
    @observable focusedTextBox = null;
    @observable picker = null;
    @observable pickerVisible = false;
    @observable keyboardVisible = false;
    @observable keyboardHeight = 0;
    @observable locale = null;
    @observable pickerHeight = 200;
    @observable languageSelected = 'en';
    @observable appState = 'active';
    @observable languages = {
        en: `English`,
        fr: `French`,
        es: `Spanish`,
        ru: `Russian`
    };

    get bottomOffset() {
        const pickerHeight = this.pickerVisible ? this.pickerHeight : 0;
        return this.keyboardHeight || pickerHeight;
    }

    @action focusTextBox(textbox) {
        this.focusedTextBox = textbox;
    }

    @action showPicker(picker) {
        this.hideKeyboard();
        this.picker = picker;
        setTimeout(() => { this.pickerVisible = true; }, 0);
    }

    @action hidePicker() {
        this.hideKeyboard();
    }

    @action hideKeyboard() {
        dismissKeyboard();
        setTimeout(() => { this.pickerVisible = false; }, 0);
    }

    @action hideAll() {
        this.hideKeyboard();
        this.hidePicker();
    }

    @action setLocale(lc) {
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
                PhraseDictionaryCollection.addDictionary(this.locale, dictString);
                PhraseDictionaryCollection.selectDictionary(this.locale);
            });
    }

    @action load() {
        return TinyDb.system.getValue('state')
            .then(s => this.setLocale(s && s.locale || 'en'));
    }

    @action save() {
        const locale = this.locale || 'en';
        return TinyDb.system.setValue('state', { locale });
    }
}

const uiState = new UIState();

reaction(() => uiState.languageSelected, ls => uiState.setLocale(ls));

reaction(() => uiState.route, () => {
    const r = uiState.routes[uiState.route];
    const pages = [];
    if (r && r.uiStates) {
        _.forOwn(r.uiStates, (val, key) => {
            pages.push(key);
        });
    }
    uiState.pages = pages;
});

reaction(() => uiState.focusedTextBox, () => {
    if (uiState.focusedTextBox) {
        uiState.pickerVisible = false;
    }
});

Keyboard.addListener('keyboardWillShow', (e) => {
    uiState.keyboardHeight = e.endCoordinates.height;
});

Keyboard.addListener('keyboardDidShow', (e) => {
    uiState.keyboardHeight = e.endCoordinates.height;
});

Keyboard.addListener('keyboardWillHide', () => {
    uiState.keyboardHeight = 0;
});

Keyboard.addListener('keyboardDidHide', () => {
    uiState.keyboardHeight = 0;
});

export default uiState;
