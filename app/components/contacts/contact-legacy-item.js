import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import { contactStore } from '../../lib/icebear';
import { t } from '../utils/translator';

@observer
export default class ContactLegacyItem extends SafeComponent {
    invite() {
        const { contact } = this.props;
        contact.invited = true;
        contactStore.invite(contact.email);
    }

    renderThrow() {
        const { contact } = this.props;
        const { username, fullName, invited } = contact;
        return (
            <Avatar
                noTap
                sending={invited}
                height={56}
                contact={contact}
                title2={t('title_inviteLegacy')}
                title={fullName}
                hideOnline />
        );
    }
}

ContactLegacyItem.propTypes = {
    contact: PropTypes.any.isRequired
};
