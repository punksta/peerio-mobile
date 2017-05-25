import React, { Component } from 'react';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import LanguagePicker from './language-picker';
import uiState from '../layout/ui-state';
import { pickerBox } from '../../styles/styles';

export default class LanguagePickerBox extends SafeComponent {
    constructor(props) {
        super(props);
        this.picker = <LanguagePicker />;
    }

    renderThrow() {
        return (
            <PickerBox
                name="languageSelected"
                picker={this.picker}
                data={uiState.languages}
                style={pickerBox}
                value={uiState.languageSelected}
                hint=""
                />
        );
    }
}
