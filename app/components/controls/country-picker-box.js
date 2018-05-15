import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import { CountryPicker } from './pickers';
import uiState from '../layout/ui-state';
import { pickerBox } from '../../styles/styles';
import { tx } from '../utils/translator';

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
                hint={tx('title_countryOfPractice')}
            />
        );
    }
}
