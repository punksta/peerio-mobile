import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, LayoutAnimation } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import FileInlineProgress from '../files/file-inline-progress';
import AvatarCircle from './avatar-circle';
import ErrorCircle from './error-circle';
import OnlineCircle from './online-circle';
import ReadReceipt from './read-receipt';
import CorruptedMessage from './corrupted-message';
import tagify from './tagify';
import { User } from '../../lib/icebear';

const itemStyle = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0,
    borderColor: 'red'
};

const bottomBorderStyle = {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)'
};

const itemContainerStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 4,
    paddingBottom: 0

};

const nameContainerStyle = {
    borderWidth: 0,
    borderColor: 'red',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
};

const nameMessageContainerStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 0,
    borderColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 16,
    marginLeft: 6,
    marginRight: 6,
    paddingTop: 0
};

const nameTextStyle = {
    color: vars.txtMedium,
    fontWeight: vars.font.weight.bold,
    fontSize: 14
};

const dateTextStyle = {
    color: vars.txtDate,
    marginLeft: 8
};

const lastMessageTextStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    fontWeight: vars.font.weight.regular,
    color: vars.txtMedium,
    fontSize: 14,
    lineHeight: 22,
    borderWidth: 0,
    borderColor: 'green'
};

const systemMessageStyle = {
    fontStyle: 'italic'
};

const { width } = Dimensions.get('window');

export default class Avatar extends SafeComponent {
    @observable showError = false;

    componentDidMount() {
        this._observer = reaction(() => this.props.receipts && this.props.receipts.length,
            () => LayoutAnimation.easeInEaseOut());
    }

    componentWillUnmount() {
        this._observer();
    }

    get checked() {
        const cs = this.props.checkedState;
        const ck = this.props.checkedKey;
        return cs && ck && !!cs.has(ck);
    }

    get checkbox() {
        if (!this.props.checkbox) return null;
        const v = vars;
        const color = this.checked ? v.checkboxActive : v.checkboxInactive;
        const iconColor = this.checked ? 'white' : v.checkboxIconInactive;
        const iconBgColor = 'transparent';
        const icon = this.checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: color,
            padding: 4
        };
        return (
            <View style={outer} pointerEvents="none">
                {icons.colored(icon, null, iconColor, iconBgColor)}
            </View>
        );
    }

    onPressAll = () => {
        console.log(`avatar.js: onPressText`);
        if (this.props.error) {
            this.showError = !this.showError;
            return null;
        }
        if (this.props.sendError && this.props.onRetryCancel) {
            return this.props.onRetryCancel();
        }
        return this.props.onPress && this.props.onPress();
    }

    get message() {
        const { ellipsize } = this.props;
        const ellipsizeMode = ellipsize ? 'tail' : undefined;
        const numberOfLines = ellipsize ? 1 : undefined;
        return this.props.message ? (
            <Text
                ellipsizeMode={ellipsizeMode}
                numberOfLines={numberOfLines}
                selectable
                style={lastMessageTextStyle}>
                {tagify(this.props.message || '', User.current.username)}
            </Text>
        ) : null;
    }

    get systemMessage() {
        const { systemMessage } = this.props;
        return systemMessage && (
            <Text style={[lastMessageTextStyle, systemMessageStyle]}>
                {systemMessage}
            </Text>
        );
    }

    get files() {
        return this.props.files ?
            this.props.files.map(file => <FileInlineProgress key={file} file={file} />) : null;
    }

    get errorCircle() {
        return <ErrorCircle onPress={this.onPressAll} invert={!this.props.sendError} visible={this.props.error || this.props.sendError} />;
    }

    get corruptedMessage() {
        return <CorruptedMessage visible={this.props.error && this.showError} />;
    }

    get retryCancel() {
        const notSentMessageStyle = {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: 8
        };
        return this.props.sendError ?
            <View style={notSentMessageStyle}>
                <Text style={{ color: vars.txtAlert }}>Message not sent</Text>
            </View> : null;
    }

    get date() {
        const unreadStyle = this.props.unread ? { color: vars.bg } : null;
        const { timestampText } = this.props;
        return timestampText ?
            <Text style={[dateTextStyle, unreadStyle]}>
                {timestampText}
            </Text> : null;
    }

    get errorStyle() {
        return this.props.error ? {
            backgroundColor: '#ff000020',
            borderRadius: 14,
            marginVertical: 2,
            marginHorizontal: 4
        } : null;
    }

    get borderStyle() {
        return this.props.noBorderBottom ? null : bottomBorderStyle;
    }

    get paddingStyle() {
        const paddingVertical = this.props.extraPaddingVertical;
        const paddingTop = this.props.extraPaddingTop;
        return (paddingVertical || paddingTop) ? { paddingVertical, paddingTop } : null;
    }

    get checkedStyle() {
        if (this.props.checkbox) return null;
        return { backgroundColor: vars.bg };
    }

    get avatar() {
        return (
            <TouchableOpacity
                style={{ alignSelf: 'flex-start' }}
                pressRetentionOffset={vars.retentionOffset}
                onPress={this.props.onPressAvatar || this.onPressAll}>
                <AvatarCircle contact={this.props.contact} loading={this.props.loading} />
            </TouchableOpacity>
        );
    }

    get star() {
        return this.props.starred ?
            <Text style={{ color: vars.gold }}>{'★ '}</Text> : null;
    }

    get title() {
        const { contact, title } = this.props;
        return (
            <View style={nameContainerStyle}>
                <View style={{ flexShrink: 1 }}>
                    <Text ellipsizeMode="tail" numberOfLines={1}>
                        {this.star}
                        <Text style={nameTextStyle}>
                            {title ||
                                <Text>
                                    {contact.fullName}
                                    <Text style={{ color: vars.txtMedium, fontWeight: 'normal' }}>
                                        {' '}{contact.username}
                                    </Text>
                                </Text>}
                        </Text>
                    </Text>
                </View>
                <View style={{ flex: 0 }}>
                    {this.date}
                </View>
            </View>
        );
    }

    get receipts() {
        const { receipts } = this.props;
        if (!receipts || !receipts.length) return null;
        const receiptRow = {
            alignSelf: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            borderWidth: 0,
            marginRight: 4,
            width: width / 1.5
        };
        let marginLeft = (width / 1.5 - 26 * receipts.length) / receipts.length;
        marginLeft = marginLeft < 0 ? marginLeft : 0;
        return (
            <View style={receiptRow}>
                {receipts.map(u => (
                    <View key={u} style={{
                        flex: 0, marginLeft, alignItems: 'flex-end', borderWidth: 0
                    }}>
                        <ReadReceipt username={u} />
                    </View>
                ))}
            </View>
        );
    }

    renderCollapsed() {
        return (
            <View style={{ flexGrow: 1 }}>
                <View style={[itemStyle, this.errorStyle]}>
                    <View
                        pointerEvents={this.props.disableMessageTapping ? 'none' : undefined}
                        style={[this.itemContainerStyle, { paddingLeft: 74, flexShrink: 1 }]}>
                        {this.message}
                        <View style={{ flex: 1, flexGrow: 1 }}>
                            {this.corruptedMessage}
                            {this.files}
                            {this.systemMessage}
                            {this.retryCancel}
                        </View>
                    </View>
                    {this.errorCircle}
                </View>
                {this.receipts}
            </View>
        );
    }

    renderFull() {
        return (
            <View style={[itemStyle, this.borderStyle, this.errorStyle, this.paddingStyle]}>
                {this.checkbox}
                <View style={[{ flexGrow: 1, maxWidth: width, flexShrink: 1 }]}>
                    <View
                        pointerEvents={this.props.disableMessageTapping ? 'none' : undefined}
                        style={itemContainerStyle}>
                        {this.avatar}
                        <View style={[nameMessageContainerStyle]}>
                            {this.title}
                            {this.message}
                            {this.files}
                            {this.systemMessage}
                            {this.retryCancel}
                        </View>
                        {this.props.rightIcon}
                        <OnlineCircle visible={!this.props.hideOnline} online={this.props.online} />
                    </View>
                    {this.errorCircle}
                    {this.corruptedMessage}
                    {this.receipts}
                </View>
            </View>
        );
    }

    renderOuter(inner) {
        const opacity = this.props.sending ? 0.5 : 1;
        const activeOpacity = this.props.noTap && !this.props.error && !this.props.sendError ?
            1 : 0.2;
        return (
            <View
                style={{ backgroundColor: vars.white, opacity }}
                onLayout={this.props.onLayout}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={this.onPressAll}
                    activeOpacity={activeOpacity}>
                    {inner}
                </TouchableOpacity>
            </View >
        );
    }

    renderThrow() {
        const inner = this.props.collapsed ? this.renderCollapsed() : this.renderFull();
        return this.renderOuter(inner);
    }
}

Avatar.propTypes = {
    onPress: React.PropTypes.func,
    onPressAvatar: React.PropTypes.func,
    onRetryCancel: React.PropTypes.func,
    contact: React.PropTypes.any,
    timestampText: React.PropTypes.any,
    files: React.PropTypes.any,
    receipts: React.PropTypes.any,
    rightIcon: React.PropTypes.any,
    message: React.PropTypes.string,
    title: React.PropTypes.string,
    systemMessage: React.PropTypes.any,
    online: React.PropTypes.bool,
    error: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    showError: React.PropTypes.bool,
    checkbox: React.PropTypes.bool,
    checkedKey: React.PropTypes.string,
    checkedState: React.PropTypes.any,
    hideOnline: React.PropTypes.bool,
    noBorderBottom: React.PropTypes.bool,
    noTap: React.PropTypes.bool,
    collapsed: React.PropTypes.bool,
    sending: React.PropTypes.bool,
    sendError: React.PropTypes.bool,
    ellipsize: React.PropTypes.bool,
    unread: React.PropTypes.bool,
    starred: React.PropTypes.bool,
    disableMessageTapping: React.PropTypes.bool,
    extraPaddingVertical: React.PropTypes.number,
    extraPaddingTop: React.PropTypes.number,
    onLayout: React.PropTypes.func
};
