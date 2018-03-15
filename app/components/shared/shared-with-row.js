import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import ReadReceipt from './read-receipt';
import { tx } from '../utils/translator';

const rowContainer = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: vars.spacing.medium.mini
};
const readReceiptStyle = {
    marginLeft: -8,
    zIndex: 1
};
const totalSharedWithContainer = {
    justifyContent: 'center',
    height: 20,
    backgroundColor: vars.sharedWithNumberBackground,
    borderRadius: 16,
    marginLeft: -20,
    paddingRight: 8,
    zIndex: 0
};
const totalSharedWithText = {
    fontSize: vars.font.size.smaller,
    fontWeight: vars.font.weight.semiBold,
    color: vars.sharedWithNumberFontColor,
    textAlign: 'right'
};

@observer
export default class SharedWithRow extends SafeComponent {
    renderThrow() {
        const { contacts, rooms } = this.props;
        if (!contacts.length && !rooms.length) return null;
        if (!contacts.length && rooms.length === 1) {
            return this.renderOneRoomOnly();
        } else if (contacts.length === 1 && rooms.length === 1) {
            return this.renderOneRoomAndOneContact();
        } else if (!contacts.length && rooms.length > 1) {
            return this.renderManyRoomsOnly();
        }
        return this.renderManySharedWith();
    }

    renderOneRoomAndOneContact() {
        const { contacts } = this.props;
        const contact = contacts[0];
        return (
            <View style={rowContainer}>
                <View key={contact.username} style={readReceiptStyle}>
                    <ReadReceipt key={contact.username} username={contact.username} avatarSize={20} />
                </View>
                <View style={[totalSharedWithContainer, { width: 70 }]} >
                    <Text style={totalSharedWithText}>
                        {tx('title_plusRoomSharedWith')}
                    </Text>
                </View>
            </View>
        );
    }

    renderOneRoomOnly() {
        return (
            <View style={rowContainer}>
                <View style={[totalSharedWithContainer, { width: 50 }]} >
                    <Text style={totalSharedWithText}>
                        {tx('title_roomSharedWith')}
                    </Text>
                </View>
            </View>
        );
    }

    renderManyRoomsOnly() {
        const { rooms } = this.props;
        const roomsSharedWith = rooms.length;
        return (
            <View style={rowContainer}>
                <View style={[totalSharedWithContainer, { width: 56 }]} >
                    <Text style={totalSharedWithText}>
                        {tx('title_roomsSharedWith', { roomsSharedWith })}
                    </Text>
                </View>
            </View>
        );
    }

    renderManySharedWith() {
        const { contacts, rooms } = this.props;
        const contactSubArray = contacts.slice(0, 3);
        let totalSharedWith = rooms.length || 0;
        if (contacts.length > 3) {
            totalSharedWith += contacts.length - contactSubArray.length;
        }
        return (
            <View style={rowContainer}>
                {contactSubArray.map((contact) => {
                    return (<View key={contact.username} style={readReceiptStyle}>
                        <ReadReceipt key={contact.username} username={contact.username} avatarSize={20} />
                    </View>);
                })}
                {!!totalSharedWith && <View style={[totalSharedWithContainer, { width: 50 }]} >
                    <Text style={totalSharedWithText}>
                        {tx('title_totalSharedWith', { totalSharedWith })}
                    </Text>
                </View>}
            </View>
        );
    }
}

SharedWithRow.propTypes = {
    contacts: PropTypes.any,
    rooms: PropTypes.any
};
