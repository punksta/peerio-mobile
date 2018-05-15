import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import icons from '../helpers/icons';
import Text from '../controls/custom-text';
import { vars, styledTextInput } from '../../styles/styles';

@observer
export default class PickerBoxIos extends SafeComponent {
    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
        this.picker = this.props.picker;
        this.opened = false;
    }

    focus() {
        this.opened = true;
        if (uiState.pickerVisible) {
            uiState.hidePicker();
            return;
        }
        uiState.showPicker(this.picker);
    }


    get errorSpacer() {
        const marginBottom = styledTextInput.errorStyle.height;
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
        const focused = uiState.pickerVisible && uiState.picker === this.picker;
        const { shadow, background, textview, container, iconContainer, icon } =
            focused ? this.props.style.active : this.props.style.normal;
        const value = this.props.value ? this.props.data[this.props.value] : this.props.hint;
        return (
            <View>
                <View style={shadow}>
                    <View
                        style={background}>
                        <TouchableOpacity testID="pickerBox" onPress={this.focus}>
                            <View
                                pointerEvents="none"
                                style={container}>
                                <Text style={[textview, (this.props.value && { color: vars.textBlack87 })]}>
                                    {value}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View
                            pointerEvents="none"
                            style={iconContainer}>
                            {icons.dark('arrow-drop-down', () => { }, icon)}
                        </View>
                    </View>
                </View>
                {this.errorMessage}
            </View>
        );
    }
}

PickerBoxIos.propTypes = {
    value: PropTypes.any.isRequired,
    picker: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
    style: PropTypes.any.isRequired,
    hint: PropTypes.any.isRequired
};
