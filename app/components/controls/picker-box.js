import React from 'react';
import SafeComponent from '../shared/safe-component';
import PickerBoxAndroid from './picker-box-android';
import PickerBoxIos from './picker-box-ios';

export default class PickerBox extends SafeComponent {
    renderThrow() {
        return global.platform === 'ios' ?
            <PickerBoxIos key="picker" {...this.props} /> : <PickerBoxAndroid {...this.props} />;
    }
}

PickerBox.propTypes = {
    value: React.PropTypes.any.isRequired,
    name: React.PropTypes.string.isRequired,
    picker: React.PropTypes.any.isRequired,
    data: React.PropTypes.any.isRequired,
    style: React.PropTypes.any.isRequired,
    hint: React.PropTypes.any.isRequired
};

