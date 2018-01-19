import PropTypes from 'prop-types';
import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { Text, ActivityIndicator, View, Image } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import ErrorCircle from './error-circle';
import { vars } from '../../styles/styles';

const avatarDiameter = 36;

@observer
export default class AvatarCircle extends SafeComponent {
    @observable avatarLoaded;

    @action.bound handleOnLoad() {
        this.avatarLoaded = true;
    }

    renderThrow() {
        const { large, medium, contact, loading, invited } = this.props;
        let ratio = 1;
        if (large) ratio = 3;
        if (medium) ratio = 2;
        const width = avatarDiameter * ratio;
        const height = width;
        const avatarStyle = {
            width,
            height,
            borderRadius: width / 2,
            margin: vars.spacing.small.mini2x * ratio
        };
        if (loading) {
            return <ActivityIndicator style={{ height, margin: vars.spacing.small.mini2x }} />;
        }

        const { color, tofuError, letter } = contact || {};
        const coloredAvatarStyle = [avatarStyle, {
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color || 'gray'
        }];
        const avatarLetter = (
            <View style={coloredAvatarStyle}>
                <Text style={{ color: 'white', textAlign: 'center', width: 14 * ratio, fontSize: vars.font.size.smaller * ratio }}>
                    {letter}
                </Text>
            </View>
        );

        const groupIcon = <View style={coloredAvatarStyle}>{icons.plainWhite('group')}</View>;
        let avatarIcon = null;
        if (contact) {
            if (invited) {
                avatarIcon = (
                    <View style={[avatarStyle, { justifyContent: 'center', alignItems: 'center' }]}>
                        {icons.plaindark('person')}
                    </View>
                );
            }
            if (contact.hasAvatar) {
                const uri = (large || medium) ? contact.largeAvatarUrl : contact.mediumAvatarUrl;
                const opacity = this.avatarLoaded ? 1 : 0;
                avatarIcon = (
                    <Image
                        source={{ uri, cache: 'force-cache' }}
                        key={uri}
                        style={[avatarStyle, { opacity }]}
                        onLoad={this.handleOnLoad}
                    />
                );
            }
        }

        return (
            <View style={{ borderWidth: 0, borderColor: 'green' }}>
                {/* if we don't have contact specified, show group icon */}
                {!contact && groupIcon}
                {avatarIcon}
                {/* show letter if there's no avatar or it hasn't loaded yet */}
                {contact && (!avatarIcon || !this.avatarLoaded) && avatarLetter}
                <ErrorCircle large={this.props.large} visible={tofuError} />
            </View>
        );
    }
}

AvatarCircle.propTypes = {
    contact: PropTypes.any,
    loading: PropTypes.bool,
    large: PropTypes.bool,
    medium: PropTypes.bool
};
