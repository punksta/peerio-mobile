import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import FileInlineProgress from '../files/file-inline-progress';
import AvatarCircle from './avatar-circle';
import ErrorCircle from './error-circle';
import OnlineCircle from './online-circle';
import ReadReceiptList from './read-receipt-list';
import CorruptedMessage from './corrupted-message';
import tagify from './tagify';

const itemStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
};

const bottomBorderStyle = {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)'
};

const itemContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 8,
    paddingRight: 4,
    paddingBottom: 8

};

const nameContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center'
};

const nameMessageContainerStyle = {
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 0,
    borderColor: 'red',
    flexDirection: 'column',
    paddingLeft: 16,
    marginLeft: 6,
    marginRight: 6,
    paddingTop: 8
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
    fontWeight: vars.font.weight.regular,
    color: vars.txtMedium,
    fontSize: 14,
    lineHeight: 22
};

@observer
export default class Avatar extends Component {
    @observable showError = false;

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

    onPressText() {
        console.log(`avatar.js: onPressText`);
        if (this.props.onPressText) {
            return this.props.onPressText();
        }
        if (this.props.error) {
            this.showError = !this.showError;
        }
        if (this.props.onPress) {
            return this.props.onPress();
        }
        return null;
    }

    get message() {
        return (
            <Text style={lastMessageTextStyle}>
                {tagify(this.props.message || '')}
            </Text>
        );
    }

    get files() {
        return this.props.files ?
            this.props.files.map(file => <FileInlineProgress key={file} file={file} />) : null;
    }

    get signatureError() {
        return <ErrorCircle invert visible={!!this.props.error} />;
    }

    get corruptedMessage() {
        return <CorruptedMessage visible={this.props.error && this.showError} />;
    }

    get retryCancel() {
        return this.props.sendError ?
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                {icons.dark('replay', this.props.onRetry)}
                {icons.dark('cancel', this.props.onCancel)}
            </View> : null;
    }

    get icon() {
        return this.props.icon ? icons.dark(this.props.icon) : null;
    }

    get date() {
        return !!this.props.date &&
            <Text style={dateTextStyle}>{moment(this.props.date).format(`MMM D, LT`)}</Text>;
    }

    get errorStyle() {
        return this.props.error || this.props.sendError ? {
            backgroundColor: '#ff000020',
            borderRadius: 14,
            marginVertical: 2,
            marginHorizontal: 4
        } : null;
    }

    get borderStyle() {
        return this.props.noBorderBottom ? null : bottomBorderStyle;
    }

    get checkedStyle() {
        if (this.props.checkbox) return null;
        return { backgroundColor: vars.bg };
    }

    renderCollapsed() {
        return (
            <View style={itemStyle}>
                <View style={[this.itemContainerStyle, { marginLeft: 66 }, this.errorStyle]}>
                    {this.message}
                    <View style={{ flexGrow: 1 }}>
                        {this.files}
                        {this.signatureError}
                    </View>
                    {this.retryCancel}
                </View>
            </View>
        );
    }

    renderFull() {
        return (
            <View style={[itemStyle, this.borderStyle]}>
                {this.checkbox}
                <View style={[{ flexGrow: 1 }, this.errorStyle]}>
                    <View style={itemContainerStyle}>
                        <TouchableOpacity onPress={this.props.onPress}>
                            <AvatarCircle contact={this.props.contact} loading={this.props.loading} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.onPressText()}
                            style={nameMessageContainerStyle}>
                            <View style={nameContainerStyle}>
                                <Text ellipsizeMode="tail" style={nameTextStyle}>
                                    {this.props.contact.username}
                                </Text>
                                {this.date}
                            </View>
                            {this.message}
                            {this.files}
                            {this.signatureError}
                        </TouchableOpacity>
                        {this.icon}
                        <OnlineCircle visible={!this.props.hideOnline} online={this.props.online} />
                    </View>
                    {this.retryCancel}
                    {this.corruptedMessage}
                    <ReadReceiptList receipts={this.props.receipts} />
                </View>
            </View>
        );
    }

    renderOuter(inner) {
        const opacity = this.props.sending ? 0.5 : 1;
        return (
            <View style={{ backgroundColor: vars.bg, opacity }} onLayout={this.props.onLayout}>
                <TouchableOpacity onPress={this.props.onPress} activeOpacity={this.props.noTap ? 1 : 0.2}>
                    {inner}
                </TouchableOpacity>
            </View >
        );
    }

    render() {
        const inner = this.props.collapsed ? this.renderCollapsed() : this.renderFull();
        return this.renderOuter(inner);
    }
}

Avatar.propTypes = {
    onPress: React.PropTypes.func,
    onRetry: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onPressText: React.PropTypes.func,
    contact: React.PropTypes.any.isRequired,
    date: React.PropTypes.any,
    files: React.PropTypes.any,
    receipts: React.PropTypes.any,
    icon: React.PropTypes.string,
    message: React.PropTypes.string,
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
    onLayout: React.PropTypes.func
};

