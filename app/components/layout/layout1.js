import React, { Component } from 'react';
import {
    View, ScrollView
} from 'react-native';
import { observer } from 'mobx-react/native';
import state from './state';

@observer
export default class Layout1 extends Component {
    constructor(props) {
        super(props);
        this.layout = this.layout.bind(this);
        this.scroll = this.scroll.bind(this);
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
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderColor: 'yellow',
                    borderWidth: 0,
                    paddingBottom: state.keyboardHeight
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
                    onScroll={this.scroll}
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
