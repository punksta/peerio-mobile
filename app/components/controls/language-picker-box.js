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
                picker={this.picker}
                data={state.languages}
                style={styles.pickerBox}
                picker={this.picker}
                hint={this.props.hint}
                value={state.languageSelected}
                />
        );
    }
}

LanguagePickerBox.propTypes = {
    onChangeText: React.PropTypes.func.isRequired,
    hint: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
};
