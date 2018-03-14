import React, { Component } from 'react';
import { observable, action, reaction } from 'mobx';
import { Keyboard, LayoutAnimation } from 'react-native';
import { observer } from 'mobx-react/native';
import ContactSelectorUniversal from '../contacts/contact-selector-universal';
import ContactEditPermission from '../contacts/contact-edit-permission';
import chatState from '../messaging/chat-state';
import fileState from './file-state';
import SharedFolderFooter from './shared-folder-footer';

@observer
export default class FolderShare extends Component {
    @observable currentPage = 0;

    componentDidMount() {
        reaction(() => this.currentPage, () => LayoutAnimation.easeInEaseOut());
    }

    @action.bound exit() { chatState.routerModal.discard(); }

    // TODO: Wiring
    @action.bound shareAction(contacts) {
        chatState.startChatAndShareFiles(contacts, fileState.currentFile);
    }

    // TODO: Wiring
    @action.bound unshareAction() {

    }

    @action.bound togglePage() {
        Keyboard.dismiss();
        if (this.currentPage === 0) {
            this.currentPage = 1;
        } else if (this.currentPage === 1) {
            this.currentPage = 0;
        }
    }

    get renderContactSelector() {
        return (
            <ContactSelectorUniversal
                onExit={this.exit}
                action={this.shareAction}
                title="title_shareWith"
                inputPlaceholder="title_TryUsernameOrEmail"
                limit={chatState.LIMIT_PEOPLE_DM}
                multiselect
                sharedFolderFooter={<SharedFolderFooter title="title_viewSharedWith" action={this.togglePage} />}
            />);
    }

    get renderContactEdit() {
        if (this.currentPage !== 1) return null;
        return (<ContactEditPermission
            onExit={this.exit}
            action={this.unshareAction}
            title="title_sharedWith"
            togglePage={this.togglePage}
            sharedFolderFooter={<SharedFolderFooter title="button_shareWithOthers" action={this.togglePage} icon="person-add" />}
        />);
    }

    render() {
        if (this.currentPage === 0) return this.renderContactSelector;
        if (this.currentPage === 1) return this.renderContactEdit;
        return null;
    }
}
