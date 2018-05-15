import { View } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerBoxAndroid from './picker-box-android';
import PickerBoxIos from './picker-box-ios';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';

@observer
export default class PickerBox extends SafeComponent {
    constructor(props) {
        super(props);
        this.opened = false;
    }

    get body() {
        return global.platform === 'ios' ?
            <PickerBoxIos key="picker" {...this.props} /> : <PickerBoxAndroid {...this.props} />;
    }

    get errorSpacer() {
        return (<View style={this.props.style.errorStyle} />);
    }

    get errorMessage() {
        if (!this.props.value && this.opened) {
            return (
                <Text style={this.props.style.errorStyle}>
                    {this.props.errorMessage}
                </Text>);
        }
        return this.errorSpacer;
    }

    renderThrow() {
        return (
            <View>
                {this.body}
                {this.errorMessage}
            </View>
        );
    }
}

PickerBox.propTypes = {
    value: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    picker: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
    style: PropTypes.any.isRequired,
    hint: PropTypes.any.isRequired,
    errorMessage: PropTypes.any.isRequired
};

