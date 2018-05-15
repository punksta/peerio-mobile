import React from 'react';
import { observer } from 'mobx-react/native';
import { LayoutAnimation } from 'react-native';
import SafeComponent from '../shared/safe-component';
import PickerPopup from './picker-popup';
import uiState from '../layout/ui-state';

@observer
class GenericPicker extends SafeComponent {
    constructor(props, data, name) {
        super(props);
        this.data = data;
        this.name = name;
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    renderThrow() {
        return (
            <PickerPopup
                name={this.name}
                onValueChange={this.onValueChange}
                data={this.data}
                state={uiState} />
        );
    }
}

@observer
class RolePicker extends GenericPicker {
    constructor(props) {
        super(props, uiState.roles, 'roleSelected');
    }
}

@observer
class CountryPicker extends GenericPicker {
    constructor(props) {
        super(props, uiState.countries, 'countrySelected');
    }
}

@observer
class SpecialtyPicker extends GenericPicker {
    constructor(props) {
        super(props, uiState.specialties, 'specialtySelected');
    }
}

module.exports = { RolePicker, CountryPicker, SpecialtyPicker };
