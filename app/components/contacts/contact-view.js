import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import AvatarCircle from '../shared/avatar-circle';
import LayoutModalExit from '../layout/layout-modal-exit';
import mainState from '../main/main-state';

const flexRow = {
    flexDirection: 'row',
    flex: 1,
    flexGrow: 1,
    alignItems: 'center'
};

@observer
export default class ContactView extends Component {

    render() {
        const contact = this.props.contact || mainState.currentContact;
        const { username, firstName, lastName, fingerprint, tofuError } = contact;
        const tofuErrorControl = tofuError && (
            <View style={{ backgroundColor: 'red', flexGrow: 1, padding: 10 }}>
                <Text>
                    This contact{'\''}s public key has CHANGED, which means it may be compromised.
                    Hit the gym, lawyer up, delete the Facebook.
                </Text>
            </View>
        );
        const body = (
            <View style={{ padding: 8 }}>
                <View style={flexRow}>
                    <AvatarCircle contact={contact} large />
                    <View>
                        <Text>Name: {firstName} {lastName}</Text>
                        <Text>Username: @{username}</Text>
                    </View>
                </View>
                {tofuErrorControl}
                <Text>Fingerprint:</Text>
                <Text>{fingerprint}</Text>
            </View>
        );
        return <LayoutModalExit body={body} title={username} />;
    }
}

ContactView.propTypes = {
    contact: React.PropTypes.any
};
