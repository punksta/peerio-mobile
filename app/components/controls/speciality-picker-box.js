import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import SpecialityPicker from './speciality-picker';
import uiState from '../layout/ui-state';
import { pickerBox } from '../../styles/styles';

@observer
export default class SpecialityPickerBox extends SafeComponent {
    constructor(props) {
        super(props);
        this.picker = <SpecialityPicker />;
    }

    renderThrow() {
        return (
            <PickerBox
                name="specialitySelected"
                picker={this.picker}
                data={uiState.specialities}
                style={pickerBox}
                value={uiState.specialitySelected}
                hint=""
            />
        );
    }
}
