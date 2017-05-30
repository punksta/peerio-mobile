import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, Picker } from 'react-native';
import _ from 'lodash';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import { vars } from '../../styles/styles';

@observer
export default class PickerBoxAndroid extends SafeComponent {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange(lang) {
        uiState[this.props.name] = lang;
    }

    layout(e) {
        console.log(e.nativeEvent.layout.height);
    }

    renderThrow() {
        // const s = this.props.style.normal;
        const { shadow } =
            this.props.style.normal;
        const items = _.values(_.mapValues(this.props.data, (value, key) =>
            <Picker.Item label={value} value={key} key={key} />));
        return (
            <View style={shadow}>
                <TouchableOpacity>
                    <Picker
                        onLayout={this.layout}
                        selectedValue={this.props.value}
                        onValueChange={this.onValueChange}
                        style={{ color: 'white', backgroundColor: vars.pickerBg }}>
                        {items}
                    </Picker>
                </TouchableOpacity>
            </View>
        );
    }
}

PickerBoxAndroid.propTypes = {
    value: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    picker: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
    style: PropTypes.any.isRequired,
    hint: PropTypes.any.isRequired
};
