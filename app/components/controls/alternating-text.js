import PropTypes from 'prop-types';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';

@observer
export default class AlternatingText extends SafeComponent {
    @observable text;

    // Alternating text behaves like the following:
    // Get initial text to start from. Every 5 seconds, change the text to the next item in the array
    componentDidMount() {
        const { initialText, textArray } = this.props;
        let index = Math.floor((Math.random() * textArray.length)); // random number from textArray
        this.text = initialText;
        this.timer = setInterval(() => {
            if (index === textArray.length - 1) index = 0;
            else index++;
            this.text = textArray[index];
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    renderThrow() {
        const { textStyle } = this.props;
        return (
            <Text style={textStyle}>
                {tx(this.text)}
            </Text>
        );
    }
}

AlternatingText.propTypes = {
    initialText: PropTypes.string,
    textArray: PropTypes.any,
    textStyle: PropTypes.any
};
