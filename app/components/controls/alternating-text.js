import PropTypes from 'prop-types';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import Text from '../controls/custom-text';

@observer
export default class AlternatingText extends SafeComponent {
    @observable textA;
    @observable textB;
    @observable emoji;

    // Alternating text behaves like the following:
    // Get initial text to start from. Every 5 seconds, change the text to the next item in the array
    componentDidMount() {
        const { initialText, messageArray } = this.props;
        let index = Math.floor((Math.random() * messageArray.length)); // random number from messageArray
        this.textA = initialText;
        this.timer = setInterval(() => {
            if (index === messageArray.length - 1) index = 0;
            else index++;
            this.textA = messageArray[index].message;
            this.textB = messageArray[index].messageB;
            this.emoji = messageArray[index].emoji;
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    renderThrow() {
        const { textStyle } = this.props;
        return (
            <Text style={textStyle}>
                {tx(this.textA)} {this.emoji} {tx(this.textB)}
            </Text>
        );
    }
}

AlternatingText.propTypes = {
    initialText: PropTypes.string,
    messageArray: PropTypes.any,
    textStyle: PropTypes.any
};
