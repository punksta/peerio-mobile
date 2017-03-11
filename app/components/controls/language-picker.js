import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { observer } from 'mobx-react/native';
import PickerPopup from './picker-popup';
import uiState from '../layout/ui-state';

@observer
export default class LanguagePicker extends Component {
    constructor(props) {
        super(props);
        this.data = uiState.languages;
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {
        return (
            <PickerPopup
                name="languageSelected"
                onValueChange={this.onValueChange}
                data={this.data}
                state={uiState} />
        );
    }
}
