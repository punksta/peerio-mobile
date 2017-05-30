import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBoxAndroid from './picker-box-android';
import PickerBoxIos from './picker-box-ios';

@observer
export default class PickerBox extends SafeComponent {
    renderThrow() {
        return global.platform === 'ios' ?
            <PickerBoxIos key="picker" {...this.props} /> : <PickerBoxAndroid {...this.props} />;
    }
}

PickerBox.propTypes = {
    value: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    picker: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
    style: PropTypes.any.isRequired,
    hint: PropTypes.any.isRequired
};

