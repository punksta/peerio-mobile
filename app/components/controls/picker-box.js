import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import state from '../layout/state';
import icons from '../helpers/icons';

@observer
export default class PickerBox extends Component {

    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
        this.picker = this.props.picker;
    }

    focus() {
        if (state.pickerVisible) {
            state.hidePicker();
            return;
        }
        state.showPicker(this.picker);
    }

    render() {
        const focused = state.pickerVisible && state.picker === this.picker;
        const {/* hint,*/ shadow, background, textview, container, iconContainer, icon } =
            focused ? this.props.style.active : this.props.style.normal;
        return (
            <View style={shadow}>
                <View
                    style={background}>
                    <TouchableOpacity onPressIn={this.focus} activeOpacity={1}>
                        <View
                            pointerEvents="none"
                            style={container}>
                            <Text style={textview}>
                                {this.props.data[this.props.value]}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View
                        pointerEvents="none"
                        style={iconContainer}>
                        {focused ?
                        icons.dark('arrow-drop-down', () => {}, icon) :
                        icons.white('arrow-drop-down', () => {}, icon)}
                    </View>
                </View>
            </View>
        );
    }
}

PickerBox.propTypes = {
    value: React.PropTypes.any.isRequired,
    picker: React.PropTypes.any.isRequired,
    data: React.PropTypes.any.isRequired,
    style: React.PropTypes.any.isRequired,
    hint: React.PropTypes.any.isRequired
};

