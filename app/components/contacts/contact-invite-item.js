import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import { contactStore } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import { tx } from '../utils/translator';

@observer
export default class ContactInviteItem extends SafeComponent {
    invite() {
        const { contact } = this.props;
        contact.invited = true;
        contactStore.invite(contact.email);
    }

    renderThrow() {
        const { contact } = this.props;
        const { username, fullName, invited } = contact;
        const title = invited ? tx('title_invitedContacts') : tx('button_invite');
        return (
            <Avatar
                noTap
                sending={invited}
                height={56}
                contact={contact}
                title2={username}
                title={fullName}
                rightIcon={buttons.uppercaseBlueButton(title, () => this.invite(), invited)}
                hideOnline />
        );
    }
}

ContactInviteItem.propTypes = {
    contact: PropTypes.any.isRequired
};
