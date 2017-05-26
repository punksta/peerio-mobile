import React from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import contactState from '../contacts/contact-state';
import { vars } from '../../styles/styles';
import { t } from '../utils/translator';

const flexRow = {
    flexDirection: 'row',
    flex: 1,
    flexGrow: 1,
    alignItems: 'center'
};

@observer
export default class ContactView extends SafeComponent {

    renderThrow() {
        const contact = this.props.contact || contactState.currentContact;
        const { username, firstName, lastName, tofuError, fingerprintSkylarFormatted } = contact;
        const tofuErrorControl = tofuError && (
            <View style={{ backgroundColor: '#D0021B', flexGrow: 1, padding: 10 }}>
                <Text style={{ color: vars.white }}>
                    This contact{'\''}s public key has changed, which means it may be compromised.
                </Text>
            </View>
        );
        const body = (
            <View>
                <View style={[flexRow, { backgroundColor: contact.color }]}>
                    <Text style={{
                        color: vars.white,
                        fontWeight: 'bold',
                        fontSize: 60,
                        marginHorizontal: 24,
                        marginVertical: 16
                    }}>
                        {contact.letter}
                    </Text>
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={2}
                            style={{
                                fontWeight: 'bold',
                                color: vars.white,
                                fontSize: 16,
                                marginVertical: 4
                            }}>{firstName} {lastName}</Text>
                        <Text style={{ color: vars.white }}>@{username}</Text>
                    </View>
                </View>
                <View style={{ margin: 24 }}>
                    {tofuErrorControl}
                    <Text style={{ color: vars.txtDate, marginVertical: 10 }}>{t('title_publicKey')}</Text>
                    <Text style={{ color: vars.txtMedium, fontFamily: `Verdana`, fontSize: 16 }} numberOfLines={2}>
                        {fingerprintSkylarFormatted}
                    </Text>
                </View>
            </View>
        );
        return <LayoutModalExit body={body} title={username} onClose={() => contactState.routerModal.discard()} />;
    }
}

ContactView.propTypes = {
    contact: React.PropTypes.any
};
