import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import AvatarCircle from './avatar-circle';
import DeletedCircle from './deleted-circle';
import testLabel from '../helpers/test-label';
import ContactNameInfo from './contact-name-info';

const itemStyle = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
};

const itemContainerStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
    paddingLeft: vars.spacing.medium.mini2x,
    paddingRight: vars.spacing.medium.mini2x
};

const titleStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 0,
    borderColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: vars.spacing.medium.mini2x,
    marginRight: vars.spacing.small.midi,
    paddingTop: 0
};

const avatarStyle = {
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 0,
    height: vars.listItemHeight
};

@observer
export default class ContactCard extends SafeComponent {
    get backgroundColor() {
        return {
            backgroundColor: this.props.backgroundColor || vars.white
        };
    }

    get opacity() {
        return {
            opacity: this.props.faded ? 0.5 : 1
        };
    }

    get avatar() {
        const { disableTapping, contact, loading, invited } = this.props;
        return (
            <TouchableOpacity
                style={avatarStyle}
                pressRetentionOffset={vars.retentionOffset}
                disabled={disableTapping} >
                <AvatarCircle contact={contact} loading={loading} invited={invited} />
                <DeletedCircle visible={contact.isDeleted} />
            </TouchableOpacity>
        );
    }

    get title() {
        const { contact } = this.props;
        return (
            <ContactNameInfo
                contact={contact}
            />
        );
    }

    renderThrow() {
        const { disableTapping, onPress, contact } = this.props;
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                onPress={onPress}
                disabled={disableTapping}
                style={this.backgroundColor}
                {...testLabel(contact.username)}>
                <View style={[itemStyle, this.backgroundColor, this.opacity]}>
                    <View
                        style={itemContainerStyle}>
                        {this.avatar}
                        <View style={[titleStyle]}>
                            {this.title}
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }
}

ContactCard.propTypes = {
    backgroundColor: PropTypes.any,
    contact: PropTypes.any,
    invited: PropTypes.any,
    onPress: PropTypes.any,
    faded: PropTypes.bool
};
