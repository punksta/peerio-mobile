import { Keyboard } from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import moment from 'moment';
import { observable, action, reaction } from 'mobx';
import translator from 'peerio-translator';
import locales from '../../lib/locales';
import { TinyDb, PhraseDictionary } from '../../lib/icebear';
import RoutedState from '../routes/routed-state';

class UIState extends RoutedState {
    @observable isFirstLogin = false;
    @observable focusedTextBox = null;
    @observable picker = null;
    @observable pickerVisible = false;
    @observable keyboardVisible = false;
    @observable keyboardHeight = 0;
    @observable locale = null;
    @observable pickerHeight = 200;
    @observable languageSelected = 'en';
    @observable appState = 'active';
    @observable debugText = 'test';
    @observable languages = {
        en: `English`
        // fr: `French`,
        // es: `Spanish`,
        // ru: `Russian`
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
                console.log(`ui-state.js: ${lc}`);
                console.log(lc);
                translator.setLocale(lc, locale);
                this.locale = lc;
                this.languageSelected = lc;
                this.save();
                moment.locale(lc);
            })
            .then(() => locales.loadDictFile(lc))
            .then(dictString => {
                PhraseDictionary.setDictionary(this.locale, dictString);
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
    console.log(`ui-state.js: keyboard height ${uiState.keyboardHeight}`);
});

Keyboard.addListener('keyboardWillHide', () => {
    uiState.keyboardHeight = 0;
});

Keyboard.addListener('keyboardDidHide', () => {
    uiState.keyboardHeight = 0;
});

export default uiState;
