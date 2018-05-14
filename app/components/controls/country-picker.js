import React from 'react';
import { observer } from 'mobx-react/native';
import { LayoutAnimation } from 'react-native';
import SafeComponent from '../shared/safe-component';
import PickerPopup from './picker-popup';
import uiState from '../layout/ui-state';

@observer
export default class CountryPicker extends SafeComponent {
    constructor(props) {
        super(props);
        this.data = uiState.countries;
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    renderThrow() {
        return (
            <PickerPopup
                name="countrySelected"
                onValueChange={this.onValueChange}
                data={this.data}
                state={uiState} />
        );
    }
}
