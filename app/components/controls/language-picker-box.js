import React, { Component } from 'react';
import { Text, View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { observer } from 'mobx-react/native';
import { Picker } from 'react-native';
import LanguagePicker from './language-picker';
import state from '../layout/state';
import styles from '../../styles/styles';

@observer
export default class LanguagePickerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.focus = this.focus.bind(this);
        this.picker = <LanguagePicker />;
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    focus() {
        this.setState({ focused: true });
        state.hideKeyboard();
        state.picker = this.picker;
        setTimeout(() => { state.pickerVisible = true; }, 0);
    }

    render() {
        const style = this.state.focused ? styles.input.active : styles.input.normal;
        let hint = this.state.focused || this.props.value && this.props.value.length ?
            styles.input.hint.scaled : styles.input.hint.full;
        return (
            <TouchableOpacity onPressIn={this.focus} accessible={true}>
                <View style={style.shadow}>
                    <View style={hint}>
                        <Text style={styles.input.hint.text}>
                            {this.props.hint}
                        </Text>
                    </View>
                    <Text style={style.textview}>{this.props.value}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

LanguagePickerBox.propTypes = {
    onChangeText: React.PropTypes.func.isRequired,
    value: React.PropTypes.any.isRequired,
    hint: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
};
