import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';

// import contactState from './contact-state';

@observer
export default class ContactItem extends SafeComponent {
    renderThrow() {
        const { contact } = this.props;
        const { username, fullName } = contact;
        return (
            <Avatar
                height={56}
                contact={contact}
                title={username}
                title2={fullName}
                hideOnline />
        );
    }
}

ContactItem.propTypes = {
    contact: PropTypes.any.isRequired
};
