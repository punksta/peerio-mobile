import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import ReadReceipt from './read-receipt';

@observer
export default class ReadReceiptList extends Component {
    render() {
        if (!this.props.receipts) return null;
        const s = {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            right: 0,
            bottom: 0
        };
        return (
            <View style={s}>
                {this.props.receipts.map(u => <ReadReceipt username={u} key={u} />)}
            </View>
        );
    }
}

ReadReceiptList.propTypes = {
    receipts: React.PropTypes.any
};

