import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import { RolePicker } from './pickers';
import uiState from '../layout/ui-state';
import { pickerBox } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class RolePickerBox extends SafeComponent {
    renderThrow() {
        return (
            <PickerBox
                name="roleSelected"
                picker={<RolePicker />}
                data={uiState.roles}
                value={uiState.roleSelected}
                hint={tx('title_yourRole')}
                errorMessage={tx('title_selectYourRole')}
                style={pickerBox}
            />
        );
    }
}
