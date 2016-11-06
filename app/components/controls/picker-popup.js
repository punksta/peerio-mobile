import React, { Component } from 'react';
import { LayoutAnimation, Picker } from 'react-native';
import { observer } from 'mobx-react/native';
import _ from 'lodash';
import state from '../layout/state';

@observer
export default class PickerPopup extends Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    onValueChange(lang) {
        state[this.props.name] = lang;
    }

    layout(e) {
        console.log(e.nativeEvent.layout.height);
    }

    render() {
        const items = _.values(_.mapValues(this.props.data, (value, key) =>
            <Picker.Item label={value} value={key} key={key} />));
        return (
            <Picker
                onLayout={this.layout}
                selectedValue={this.props.value}
                onValueChange={this.onValueChange}
                style={{
                    flex: 0,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: state.pickerVisible ? state.pickerHeight : 0
                }}>
                {items}
            </Picker>
        );
    }
}

PickerPopup.propTypes = {
    data: React.PropTypes.any.isRequired,
    value: React.PropTypes.any.isRequired,
    name: React.PropTypes.string.isRequired
};
