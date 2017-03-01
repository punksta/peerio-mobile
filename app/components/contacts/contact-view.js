import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import AvatarCircle from '../shared/avatar-circle';
import LayoutModalExit from '../layout/layout-modal-exit';
import mainState from '../main/main-state';
import { vars } from '../../styles/styles';

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
            <View style={{ backgroundColor: '#D0021B', flexGrow: 1, padding: 10, marginVertical: 24 }}>
                <Text style={{ color: vars.white }}>
                    This contact{'\''}s public key has changed, which means it may be compromised.
                </Text>
            </View>
        );
        let i = 0;
        const fingerprintFormatted = fingerprint.replace(/-/g, () => (i++ === 2 ? '\n' : ' '));
        const body = (
            <View style={{ padding: 8 }}>
                <View style={flexRow}>
                    <AvatarCircle contact={contact} large />
                    <View>
                        <Text style={{ fontWeight: 'bold', color: vars.txtDark, fontSize: 16, marginVertical: 10 }}>{firstName} {lastName}</Text>
                        <Text style={{ color: vars.txtMedium }}>@{username}</Text>
                    </View>
                </View>
                {tofuErrorControl}
                <Text style={{ color: vars.txtDate, marginVertical: 10 }}>Fingerprint:</Text>
                <Text style={{ color: vars.txtMedium }} numberOfLines={2}>
                    {fingerprintFormatted}
                </Text>
            </View>
        );
        return <LayoutModalExit body={body} title={username} />;
    }
}

ContactView.propTypes = {
    contact: React.PropTypes.any
};
