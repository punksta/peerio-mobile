import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import { SpecialtyPicker } from './pickers';
import uiState from '../layout/ui-state';
import { pickerBox } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class SpecialtyPickerBox extends SafeComponent {
    constructor(props) {
        super(props);
        this.picker = <SpecialtyPicker />;
    }

    renderThrow() {
        return (
            <PickerBox
                name="specialtySelected"
                picker={this.picker}
                data={uiState.specialties}
                style={pickerBox}
                value={uiState.specialtySelected}
                hint={tx('title_specialty')}
                errorMessage={tx('title_selectYourSpecialty')}
            />
        );
    }
}
