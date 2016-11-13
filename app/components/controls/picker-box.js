import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PickerBoxAndroid from './picker-box-android';
import PickerBoxIos from './picker-box-ios';


@observer
export default class PickerBox extends Component {
    render() {
        return global.platform === 'ios' ?
            <PickerBoxIos {...this.props} /> : <PickerBoxAndroid {...this.props} />;
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

