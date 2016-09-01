import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../styles/styles';

export default class Layout1 extends Component {
    render() {
        return (
            <View style={styles.container.root}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps
                    contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}
                    extraHeight={0}>
                    {this.props.body}
                   {this.props.footer}
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

Layout1.propTypes = {
    body: React.PropTypes.any,
    footer: React.PropTypes.any
};
