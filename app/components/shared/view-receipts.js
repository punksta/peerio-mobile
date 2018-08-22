import PropTypes from 'prop-types';
import React from 'react';
import { View, LayoutAnimation, Dimensions } from 'react-native';
import { reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import ReadReceipt from './read-receipt';
import { vars } from '../../styles/styles';

const { width } = Dimensions.get('window');

const receiptRow = {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderWidth: 0,
    marginRight: vars.spacing.small.mini2x,
    width: width / 1.5
};

const receiptItem = {
    flex: 0,
    alignItems: 'flex-end',
    borderWidth: 0
};

@observer
export default class ViewReceipts extends SafeComponent {
    componentDidMount() {
        const { receipts } = this.props;
        this._observer = reaction(() => receipts && receipts.length,
            () => LayoutAnimation.easeInEaseOut());
    }

    componentWillUnmount() {
        this._observer();
    }

    get marginStyle() {
        const { receipts } = this.props;

        let margin = (width / 1.5 - 26 * receipts.length) / receipts.length;
        margin = margin < 0 ? margin : 0;

        return { marginLeft: margin };
    }

    renderThrow() {
        const { receipts } = this.props;
        if (!receipts || !receipts.length) return null;

        return (
            <View style={receiptRow}>
                {receipts.map(r => (
                    <View key={r.username} style={[receiptItem, this.marginStyle]}>
                        <ReadReceipt username={r.username} />
                    </View>
                ))}
            </View>
        );
    }
}

ViewReceipts.propTypes = {
    receipts: PropTypes.any
};
