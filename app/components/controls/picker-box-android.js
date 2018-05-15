import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, Picker } from 'react-native';
import _ from 'lodash';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

@observer
export default class PickerBoxAndroid extends SafeComponent {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        this.opened = true;
    }

    onValueChange(lang) {
        uiState[this.props.name] = lang;
    }

    layout(e) {
        console.log(e.nativeEvent.layout.height);
    }

    renderThrow() {
        const { shadow, iconContainer, icon } = this.props.style.normal;
        const items = _.values(_.mapValues(this.props.data, (value, key) =>
            <Picker.Item label={value} value={key} key={key} />));

        return (
            <View style={shadow}>
                <TouchableOpacity onPress={this.onPress}>
                    <Picker
                        onLayout={this.layout}
                        selectedValue={(this.props.value || this.props.hint)}
                        onValueChange={this.onValueChange}
                        style={[{ backgroundColor: vars.pickerBg, color: vars.textBlack38 }, (this.props.value && { color: vars.textBlack87 })]}>
                        {items}
                    </Picker>
                    <View
                        pointerEvents="none"
                        style={iconContainer}>
                        {icons.dark('arrow-drop-down', () => { }, icon)}
                    </View>
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
