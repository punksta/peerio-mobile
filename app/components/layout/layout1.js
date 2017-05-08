import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import SnackBarConnection from '../snackbars/snackbar-connection';

@observer
export default class Layout1 extends Component {
    @observable height = 0;

    render() {
        const boxStyle = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between'
        };

        const contentContainerStyle = {
            flexGrow: 1,
            minHeight: this.height
        };

        const fillerStyle = {
            flexGrow: 1,
            justifyContent: 'space-between'
        };

        return (
            <View
                onLayout={event => (this.height = event.nativeEvent.layout.height)}
                testID="layout1"
                style={[boxStyle, this.props.style]}>
                {this.props.header}
                <ScrollView
                    contentContainerStyle={contentContainerStyle}
                    style={{ flex: 1, flexGrow: 1 }}
                    scrollEnabled={!this.props.noScroll}
                    keyboardShouldPersistTaps="handled">
                    <View style={fillerStyle}>
                        {this.props.body}
                        {this.props.footer}
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
