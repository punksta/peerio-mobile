import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { observer } from 'mobx-react/native';
import PickerPopup from './picker-popup';
import state from '../layout/state';

@observer
export default class LanguagePicker extends Component {
    constructor(props) {
        super(props);
        this.data = state.languages;
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {
        return (
            <PickerPopup
                name="languageSelected"
                onValueChange={this.onValueChange}
                data={this.data}
                state={state} />
        );
    }
}
