import React from 'react';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import SnackBarConnection from '../snackbars/snackbar-connection';
import { vars } from '../../styles/styles';

export default class Layout2 extends SafeComponent {
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

    renderThrow() {
        return (
            <View style={{
                flex: 1,
                borderColor: 'yellow',
                borderWidth: 0,
                paddingTop: vars.layoutPaddingTop
            }}>
                {this.props.body}
                {this.props.footer}
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <SnackBarConnection />
                </View>
            </View>
        );
    }
}

Layout2.propTypes = {
    body: React.PropTypes.any,
    footer: React.PropTypes.any
};

