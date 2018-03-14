import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, ListView } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { tx, tu } from '../utils/translator';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import Layout1 from '../layout/layout1';
import fileState from '../files/file-state';
import contactState from './contact-state';
import ContactEditPermissionItem from './contact-edit-permission-item';

@observer
export default class ContactEditPermission extends SafeComponent {
    @observable dataSource = [];

    get data() { return contactState.store.contacts; }

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 || r1.showWarning !== r2.showWarning
        });
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data
        ], () => {
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
            this.forceUpdate();
        }, true);
    }

    get unshareButton() {
        const extraWidth = 20;
        if (fileState.currentFile.isFolder && fileState.currentFile.isShared) {
            return icons.text(tu('button_unshare'), this.props.action, null, null, extraWidth);
        }
        return icons.disabledText(tu('button_unshare'), null, extraWidth);
    }

    exitRow() {
        const container = {
            flexDirection: 'row',
            paddingTop: vars.spacing.small.midi2x + (vars.statusBarHeight * 2),
            paddingHorizontal: vars.spacing.small.midi2x,
            alignItems: 'center'
        };
        const textStyle = {
            textAlign: 'center',
            flexGrow: 1,
            flexShrink: 1,
            fontSize: vars.font.size.big,
            fontWeight: vars.font.weight.semiBold,
            color: vars.txtDark
        };
        return (
            <View style={container}>
                {icons.dark('close', this.props.onExit, { paddingRight: 20 })}
                <Text style={textStyle}>{tx(this.props.title)}</Text>
                {this.unshareButton}
            </View>
        );
    }

    item = (contact) => {
        return (<ContactEditPermissionItem contact={contact} />);
    };

    body() {
        return (
            <ListView
                dataSource={this.dataSource}
                renderRow={this.item} />);
    }

    renderThrow() {
        const { sharedFolderFooter } = this.props;
        const header = this.exitRow();
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout1
                defaultBar
                body={body}
                header={header}
                noFitHeight
                footerAbsolute={sharedFolderFooter}
                style={layoutStyle} />
        );
    }
}

ContactEditPermission.propTypes = {
    title: PropTypes.any,
    action: PropTypes.func,
    onExit: PropTypes.func,
    sharedFolderFooter: PropTypes.any
};
