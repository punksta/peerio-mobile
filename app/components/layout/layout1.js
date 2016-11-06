import React, { Component } from 'react';
import {
    View, ScrollView, PanResponder
} from 'react-native';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';
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
                state.hideAll();
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
        return (
            <View
                {...this.panResponder.panHandlers}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderColor: 'yellow',
                    borderWidth: 0,
                    paddingTop: styles.vars.layoutPaddingTop,
                    paddingBottom: offset
                }}>
                <ScrollView
                    ref={(ref) => { this.scrollView = ref; }}
                    style={{
                        flex: 1,
                        borderColor: 'green',
                        borderWidth: 0
                    }}
                    contentContainerStyle={{
                        flex: 1,
                        height: this.scrollViewHeight,
                        borderColor: 'red',
                        borderWidth: 0
                    }}
                    keyboardShouldPersistTaps
                    onScroll={this.onScroll}
                    onLayout={this.layout}>
                    {this.props.body}
                </ScrollView>
                {this.props.footer}
            </View>
        );
    }
}

Layout1.propTypes = {
    body: React.PropTypes.any,
    footer: React.PropTypes.any
};
