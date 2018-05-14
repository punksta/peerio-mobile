import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import CountryPicker from './country-picker';
import uiState from '../layout/ui-state';
import { pickerBox } from '../../styles/styles';

@observer
export default class CountryPickerBox extends SafeComponent {
    constructor(props) {
        super(props);
        this.picker = <CountryPicker />;
    }

    renderThrow() {
        return (
            <PickerBox
                name="countrySelected"
                picker={this.picker}
                data={uiState.countries}
                style={pickerBox}
                value={uiState.countrySelected}
                hint=""
            />
        );
    }
}
