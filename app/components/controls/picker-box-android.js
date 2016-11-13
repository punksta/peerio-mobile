import React, { Component } from 'react';
import { View, TouchableOpacity, Picker } from 'react-native';
import { observer } from 'mobx-react/native';
import _ from 'lodash';
import state from '../layout/state';

@observer
export default class PickerBoxAndroid extends Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange(lang) {
        state[this.props.name] = lang;
    }

    layout(e) {
        console.log(e.nativeEvent.layout.height);
    }

    render() {
        // const s = this.props.style.normal;
        const {/* hint,*/ shadow, background, textview, container, iconContainer, icon } =
            this.props.style.normal;
        const items = _.values(_.mapValues(this.props.data, (value, key) =>
            <Picker.Item label={value} value={key} key={key} />));
        return (
            <View style={shadow}>
                <View
                    style={background}>
                    <TouchableOpacity style={{ paddingRight: 10 }}>
                        <Picker
                            onLayout={this.layout}
                            selectedValue={this.props.value}
                            onValueChange={this.onValueChange}
                            style={{ color: 'white' }}>
                            {items}
                        </Picker>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

PickerBoxAndroid.propTypes = {
    value: React.PropTypes.any.isRequired,
    name: React.PropTypes.string.isRequired,
    picker: React.PropTypes.any.isRequired,
    data: React.PropTypes.any.isRequired,
    style: React.PropTypes.any.isRequired,
    hint: React.PropTypes.any.isRequired
};
