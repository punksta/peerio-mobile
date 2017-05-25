import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import ghostState from './ghost-state';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { mailStore } from '../../lib/icebear';

const row = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

const rowFill = {
    flexDirection: 'row',
    alignItems: 'center'
};

const block = {
    padding: 8,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderBottomColor: '#00000020'
};

const normalText = {
    color: vars.txtDark
};

const lightText = {
    color: vars.subtleText
};

const shrinkFill = {
    flexGrow: 1,
    flexShrink: 1
};


export default class GhostItem extends SafeComponent {
    reloadGhosts() {
        // TODO: remove when client lib handles updates
        mailStore.loaded = false;
        mailStore.ghosts.clear();
        mailStore.loadAllGhosts();
    }

    press() {
        ghostState.view(this.props.ghost);
    }

    renderThrow() {
        const g = this.props.ghost;
        const text = g.expired ? (
            <Text style={[lightText, { color: vars.txtAlert }]}>{'EXPIRED'}</Text>
        ) : (
            <Text style={lightText}>{moment(g.timestamp).format(`L`)}</Text>
        );
        return (
            <TouchableOpacity onPress={() => this.press()}>
                <View style={block}>
                    <View style={row}>
                        <Text style={normalText}>{g.subject}</Text>
                        {text}
                    </View>
                    <Text style={lightText}>{g.recipients.join(', ')}</Text>
                    <View style={rowFill}>
                        <Text style={[lightText, shrinkFill]} ellipsizeMode="tail" numberOfLines={1}>{g.preview}</Text>
                        <Menu onSelect={action => action().then(() => this.reloadGhosts())}>
                            <MenuTrigger style={{ padding: vars.iconPadding }}>
                                {icons.plaindark('more-vert')}
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption value={() => g.revoke()}>
                                    <Text>Revoke</Text>
                                </MenuOption>
                                <MenuOption value={() => g.remove()}>
                                    <Text>Delete</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

GhostItem.propTypes = {
    ghost: React.PropTypes.any.isRequired
};
