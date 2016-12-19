import React, { Component } from 'react';
import {
    View, ScrollView, PanResponder
} from 'react-native';
import { observer } from 'mobx-react/native';
import SnackBarConnection from '../snackbars/snackbar-connection';
import { vars } from '../../styles/styles';
import state from './state';

@observer
export default class Layout1 extends Component {
    constructor(props) {
        super(props);
        this.layout = this.layout.bind(this);
        this.scroll = this.scroll.bind(this);
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (/* evt, gestureState */) => {
                !this.props.noAutoHide && state.hideAll();
                return false;
            }
        });
    }

    layout(e) {
        if (!this.scrollViewHeight) {
            this.scrollViewHeight = e.nativeEvent.layout.height;
        }
    }

    scroll(e) {
        this.scrollViewTop = e.nativeEvent.contentOffset.y;
    }

    render() {
        const offset = state.pickerVisible ? state.pickerHeight : state.keyboardHeight;
        const paddingTop = vars.layoutPaddingTop;

        const boxStyle = {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderColor: 'yellow',
            borderWidth: 0,
            paddingTop,
            paddingBottom: this.props.noKeyboard ? 0 : offset
        };

        const scrollViewStyle = {
            flex: 1,
            borderColor: 'green',
            borderWidth: 0
        };

        const contentContainerStyle = this.props.noFitHeight ? {} : {
            flex: 1,
            height: this.scrollViewHeight,
            borderColor: 'red',
            borderWidth: 0
        };

        const svRef = (ref) => (this.scrollView = ref);

        return (
            <View
                testID="layout1"
                {...this.panResponder.panHandlers}
                style={[boxStyle, this.props.style]}>
                {this.props.header}
                <ScrollView
                    ref={svRef}
                    style={[scrollViewStyle]}
                    contentContainerStyle={[contentContainerStyle]}
                    keyboardShouldPersistTaps
                    onScroll={this.onScroll}
                    onLayout={this.layout}>
                    {this.props.body}
                {this.props.footer}
                </ScrollView>
                <SnackBarConnection />
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
    noFitHeight: React.PropTypes.bool,
    noAutoHide: React.PropTypes.bool,
    noKeyboard: React.PropTypes.bool,
    defaultBar: React.PropTypes.bool
};
