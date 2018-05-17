import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import { RolePicker } from './pickers';
import whiteLabelUiState from '../layout/white-label-ui-state';
import { pickerBox } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class RolePickerBox extends SafeComponent {
    renderThrow() {
        return (
            <PickerBox
                name="roleSelected"
                picker={<RolePicker />}
                data={whiteLabelUiState.roles}
                value={whiteLabelUiState.roleSelected}
                hint={tx('title_yourRole')}
                errorMessage={tx('title_selectYourRole')}
                style={pickerBox}
            />
        );
    }
}
