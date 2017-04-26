import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import LayoutModalExit from '../layout/layout-modal-exit';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

const flexRow = {
    flexDirection: 'row',
    flex: 1,
    flexGrow: 1,
    alignItems: 'center'
};

@observer
export default class ChatInfo extends Component {

    render() {
        const chat = chatState.currentChat;
        const body = (
            <View>
                <Text>Chat Info</Text>
            </View>
        );
        const rightIcon = icons.dark(chat.isFavorite ? 'star' : 'star-border',
            () => chat.toggleFavoriteState());
        return <LayoutModalExit
            body={body}
            title={chatState.title}
            rightIcon={rightIcon}
            onClose={() => contactState.routerModal.discard()} />;
    }
}

ChatInfo.propTypes = {
    chat: React.PropTypes.any
};
