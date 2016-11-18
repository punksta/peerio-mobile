import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PickerBox from './picker-box';
import LanguagePicker from './language-picker';
import state from '../layout/state';
import styles from '../../styles/styles';

@observer
export default class LanguagePickerBox extends Component {
    constructor(props) {
        super(props);
        this.picker = <LanguagePicker />;
    }

    render() {
        return (
            <PickerBox
                name="languageSelected"
                picker={this.picker}
                data={state.languages}
                style={styles.pickerBox}
                value={state.languageSelected}
                hint=""
                />
        );
    }
}
