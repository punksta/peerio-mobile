import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    LayoutAnimation
} from 'react-native';
import styles from '../../styles/styles';

export default class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.blur = this.blur.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    blur() {
        this.setState({ focused: false });
    }

    focus() {
        this.setState({ focused: true });
    }

    render() {
        const style = this.state.focused ? styles.input.active : styles.input.normal;
        const hintStyleOn = { position: 'absolute', top: 18, left: 10 };
        const hintStyleOff = { position: 'absolute', top: 6, left: 8, transform: [{ scale: 0.8 }] };
        let hint = this.state.focused || this.props.value && this.props.value.length ? hintStyleOff : hintStyleOn;
        return (
            <TouchableWithoutFeedback onPress={() => this.textinput}>
                <View style={style.shadow}>
                    <TextInput
                        ref={t => { this.textinput = t; }}
                        style={style.textbox}
                        value={this.props.value}
                        onFocus={this.focus}
                        onBlur={this.blur}
                        onChangeText={(text) => this.props.onChangeText(this.props.name, text)}
                        autoCorrect={false}
                    />
                    <View style={hint}>
                        <Text style={{ color: 'gray', fontSize: 14 }}>
                            {this.props.hint}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

TextBox.propTypes = {
    onChangeText: React.PropTypes.func.isRequired,
    value: React.PropTypes.any.isRequired,
    hint: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
};
