import React, { Component, PropTypes } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import PureRenderMixin from 'react-addons-pure-render-mixin';

const styles = StyleSheet.create({
    default: {
        textAlign: 'left',
        padding: 0,
        paddingBottom: 6,
        marginTop: 6
    }
});

export default class AutoExpandingTextInput extends Component {

    constructor(props) {
        super(props);
        // initial state
        this.state = {
            height: this.props.minHeight,
            maxHeight: this.props.maxHeight || this.props.minHeight * 3
        };
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    static propTypes = {
        onChangeHeight: PropTypes.func.isRequired,
        minHeight: PropTypes.number.isRequired,
        maxHeight: PropTypes.number
    };

    static defaultProps = {};

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === '') {
            this.setState({
                height: this.props.minHeight
            });
        }
    }

    _onChange = (event) => {
        const curHeight = event.nativeEvent.contentSize.height;
        if (curHeight < this.props.minHeight || curHeight > this.state.maxHeight) return;

        if (this.state.height !== curHeight) {
            if (this.props.onChangeHeight) {
                this.props.onChangeHeight(this.state.height, curHeight);
            }
        }

        this.setState({
            height: curHeight
        });
    }

    render() {
        const tmpHeight = Math.min(this.state.maxHeight, this.state.height);
        return (
            <TextInput
                {...this.props}
                ref={ti => (this.ti = ti)}
                underlineColorAndroid={'transparent'}
                multiline
                onChange={this._onChange}
                style={[styles.default, this.props.style, { height: tmpHeight }]}
            />
        );
    }
}

AutoExpandingTextInput.propTypes = {
    style: React.PropTypes.any,
    value: React.PropTypes.any
};
