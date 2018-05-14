import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBox from './picker-box';
import RolePicker from './role-picker';
import uiState from '../layout/ui-state';
import { pickerBox } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class RolePickerBox extends SafeComponent {
    constructor(props) {
        super(props);
        this.picker = <RolePicker />;
    }

    renderThrow() {
        return (
            <PickerBox
                name="roleSelected"
                picker={this.picker}
                data={uiState.roles}
                style={pickerBox}
                value={uiState.roleSelected}
                hint={tx('title_yourRole')}
            />
        );
    }
}
