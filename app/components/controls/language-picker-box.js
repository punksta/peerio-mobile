import React, { Component } from 'react';
import { Text, View, TouchableOpacity, LayoutAnimation, Picker } from 'react-native';
import { observer } from 'mobx-react/native';
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
        state.showPicker(this.picker);
        this.setState({ focused: true });
    }

    render() {
        const focused = state.pickerVisible && state.picker === this.picker;
        const style = focused ? styles.input.active : styles.input.normal;
        let hint = focused || this.props.value && this.props.value.length ?
            styles.input.hint.scaled : styles.input.hint.full;
        return (
            <View style={style.shadow}>
                <View
                    style={{ backgroundColor: styles.vars.inputBg }}>
                    <TouchableOpacity onPressIn={this.focus}>
                        <View
                            pointerEvents="none"
                            style={{
                                height: styles.vars.inputHeight,
                                backgroundColor: focused ? 'transparent' : styles.vars.subtleBg,
                                opacity: 1 }}>
                            <Text style={style.textview}>{this.props.value}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={hint}>
                        <Text style={styles.input.hint.text}>
                            {this.props.hint}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

LanguagePickerBox.propTypes = {
    onChangeText: React.PropTypes.func.isRequired,
    value: React.PropTypes.any.isRequired,
    hint: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
};
