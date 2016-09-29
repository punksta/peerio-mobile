import React, { Component } from 'react';
import {
    View, ScrollView, Text, LayoutAnimation
} from 'react-native';
import { observer } from 'mobx-react/native';
import state from './state';
import styles from '../../styles/styles';

@observer
export default class Layout2 extends Component {
    constructor(props) {
        super(props);
        this.layout = this.layout.bind(this);
        this.scroll = this.scroll.bind(this);
    }

    layout(e) {
        this.scrollViewHeight = e.nativeEvent.layout.height;
    }

    scroll(e) {
        this.scrollViewTop = e.nativeEvent.contentOffset.y;
    }

    render() {
        console.log(state.keyboardHeight);
        return (
            <View style={{
                flex: 1,
                borderColor: 'yellow',
                borderWidth: 0,
                paddingTop: styles.vars.layoutPaddingTop
            }}>
                {this.props.body}
                {this.props.footer}
            </View>
        );
    }
}

Layout2.propTypes = {
    body: React.PropTypes.any,
    footer: React.PropTypes.any
};

