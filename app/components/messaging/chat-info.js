import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import LayoutModalExit from '../layout/layout-modal-exit';
import contactState from '../contacts/contact-state';
import { vars } from '../../styles/styles';

const flexRow = {
    flexDirection: 'row',
    flex: 1,
    flexGrow: 1,
    alignItems: 'center'
};

@observer
export default class ChatInfo extends Component {

    render() {
        const chat = this.props.chat || {};
        const body = (
            <View>
                <Text>Chat Info</Text>
            </View>
        );
        return <LayoutModalExit body={body} title={chat} onClose={() => contactState.routerModal.discard()} />;
    }
}

ChatInfo.propTypes = {
    chat: React.PropTypes.any
};
