import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import { contactStore } from '../../lib/icebear';
import buttons from '../helpers/buttons';

@observer
export default class ContactItem extends SafeComponent {
    invite() {
        const { contact } = this.props;
        contact.invited = true;
        contactStore.invite(contact.email);
    }

    renderThrow() {
        const { contact } = this.props;
        const { username, fullName, invited } = contact;
        const title = invited ? 'Invited' : 'Invite';
        return (
            <Avatar
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

ContactItem.propTypes = {
    contact: PropTypes.any.isRequired
};
