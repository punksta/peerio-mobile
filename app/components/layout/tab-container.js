import PropTypes from 'prop-types';
import React from 'react';
import { when } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { t } from '../utils/translator';
import { vars } from '../../styles/styles';
import { fileStore, chatInviteStore, chatStore } from '../../lib/icebear';
import fileState from '../files/file-state';
import contactState from '../contacts/contact-state';
import routerMain from '../routes/router-main';
import uiState from './ui-state';
import { invitationState } from '../states';
import TabItem from './tab-item';

const bottomRowStyle = {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: vars.darkBlueBackground15,
    height: vars.tabsHeight,
    padding: 0,
    paddingBottom: vars.iPhoneXBottom
};

@observer
export default class TabContainer extends SafeComponent {
    async componentDidMount() {
        when(() => this.filesRef.layoutLoaded, () => {
            uiState.beaconCoords = {
                x: this.filesRef.pageX, y: this.filesRef.pageY
            };
        });
    }

    setFilesRef = ref => {
        this.filesRef = ref;
    };

    renderThrow() {
        if (uiState.keyboardHeight) return null;
        if (routerMain.currentIndex !== 0) return null;
        if (fileState.isFileSelectionMode) return null;
        if (invitationState.currentInvitation) return null;
        if (uiState.hideTabs) return null;
        return (
            <View style={bottomRowStyle}>
                <TabItem
                    text={t('title_chats')}
                    route="chats"
                    icon="forum"
                    highlightList={['space']}
                    bubble={chatStore.unreadMessages + chatInviteStore.received.length} />
                <TabItem
                    text={t('title_files')}
                    route="files"
                    icon="folder"
                    bubble={fileStore.unreadFiles} />
                <TabItem
                    text={t('title_contacts')}
                    route={contactState.empty ? 'contactAdd' : 'contacts'}
                    icon="people"
                    highlightList={['contactAdd', 'contactInvite']} />
                <TabItem
                    ref={this.setFilesRef}
                    text={t('title_settings')}
                    route="settings"
                    icon="settings" />
            </View>
        );
    }
}

TabContainer.propTypes = {
    height: PropTypes.any
};
