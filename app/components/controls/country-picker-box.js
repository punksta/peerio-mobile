import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import { CountryPicker } from './pickers';
import whiteLabelUiState from '../layout/white-label-ui-state';
import { pickerBox } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class CountryPickerBox extends SafeComponent {
    renderThrow() {
        return (
            <PickerBox
                name="countrySelected"
                picker={<CountryPicker />}
                data={whiteLabelUiState.countries}
                value={whiteLabelUiState.countrySelected}
                hint={tx('title_countryOfPractice')}
                style={pickerBox}
            />
        );
    }
}
