import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import SnackBarConnection from '../snackbars/snackbar-connection';
import { vars } from '../../styles/styles';
import uiState from '../layout/ui-state';

const { height } = Dimensions.get('window');

@observer
export default class Layout1 extends Component {
    render() {
        const paddingTop = vars.layoutPaddingTop;
        const paddingBottom = global.platform === 'android' ? 0 : uiState.keyboardHeight;

        const boxStyle = {
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderColor: 'yellow',
            borderWidth: 0
        };


        const contentContainerStyle = {
            flexGrow: 1,
            justifyContent: 'space-between',
            borderWidth: 0,
            borderColor: 'red'
        };

        return (
            <View
                testID="layout1"
                style={[boxStyle, this.props.style]}>
                {this.props.header}
                <ScrollView
                    scrollEnabled={!this.props.noScroll}
                    keyboardShouldPersistTaps="handled">
                    <View style={contentContainerStyle}>
                        <View style={{ minHeight: height }}>
                            {this.props.body}
                            {this.props.footer}
                        </View>
                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <SnackBarConnection />
                </View>
            </View>
        );
    }
}

Layout1.propTypes = {
    body: React.PropTypes.any,
    style: React.PropTypes.any,
    footer: React.PropTypes.any,
    header: React.PropTypes.any,
    padding: React.PropTypes.any,
    noScroll: React.PropTypes.bool,
    noFitHeight: React.PropTypes.bool,
    noAutoHide: React.PropTypes.bool,
    noKeyboard: React.PropTypes.bool,
    defaultBar: React.PropTypes.bool
};
