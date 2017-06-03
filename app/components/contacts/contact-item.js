import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
// import contactState from './contact-state';

@observer
export default class ContactItem extends SafeComponent {
    renderThrow() {
        const { contact } = this.props;
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Text>contact</Text>
            </View>
        );
    }
}

ContactItem.propTypes = {
    contact: PropTypes.any.isRequired
};
