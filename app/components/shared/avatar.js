import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, Linking
} from 'react-native';
import moment from 'moment';
import * as linkify from 'linkifyjs-peerio';
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

const itemStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
};

const itemContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)'
};

const itemContainerStyleNoBorder = {
    flexGrow: 1,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'flex-start'
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
    padding: 8,
    paddingLeft: 16,
    marginLeft: 6,
    marginRight: 6
};

const nameTextStyle = {
    color: 'rgba(0, 0, 0, .54)',
    fontWeight: vars.font.weight.bold,
    fontSize: 14
};

const dateTextStyle = {
    color: 'rgba(0, 0, 0, .38)',
    marginLeft: 8
};

const lastMessageTextStyle = {
    fontWeight: vars.font.weight.regular,
    color: 'rgba(0, 0, 0, .54)',
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

    checkbox() {
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

    message(m) {
        const tagify = (t, r, s, n) => {
            return t.split(r).map((token, i) => {
                return <Text key={i} style={i % 2 ? s : null}>{n ? n(token) : token}</Text>;
            });
        };
        const tagifyB = (t) => tagify(t, /<\/*b>/, { fontWeight: 'bold' });
        const tagifyI = (t) => tagify(t, /<\/*i>/, { fontStyle: 'italic' }, tagifyB);
        const items = linkify.tokenize(m).map((token, i) => {
            const p = token.isLink ? () => {
                Linking.openURL(token.toHref());
            } : null;
            const str = token.toString();
            const t = token.isLink ? str : tagifyI(str);
            const s = token.isLink ? {
                textDecorationLine: 'underline',
                color: vars.bg
            } : null;
            return <Text onPress={p} key={i} style={s}>{t}</Text>;
        });
        // console.info(items);
        return (
            <Text style={lastMessageTextStyle}>
                {items}
            </Text>
        );
    }

    render() {
        const error = this.props.error;
        const errorStyle = error ? {
            backgroundColor: '#ff000020',
            borderRadius: 14,
            marginVertical: 2,
            marginHorizontal: 4
        } : null;
        const message = this.props.message || '';
        const icon = this.props.icon ? icons.dark(this.props.icon) : null;
        const date = this.props.date ?
            <Text style={dateTextStyle}>{moment(this.props.date).format('MMM D, LT')}</Text> : null;
        const checkbox = this.props.checkbox ? this.checkbox() : null;
        const ics = this.props.noBorderBottom ? itemContainerStyleNoBorder : itemContainerStyle;
        const files = this.props.files ?
            this.props.files.map(file => <FileInlineProgress key={file.id} file={file} />) : null;
        return (
            <View style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity onPress={this.props.onPress} activeOpacity={this.props.noTap ? 1 : 0.2}>
                    <View style={itemStyle}>
                        {checkbox}
                        <View style={[{ flexGrow: 1 }, errorStyle]}>
                            <View style={ics}>
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
                                        {date}
                                    </View>
                                    {this.message(message)}
                                    {files}
                                    <ErrorCircle invert visible={!!error} />
                                </TouchableOpacity>
                                {icon}
                                <OnlineCircle visible={!this.props.hideOnline} online={this.props.online} />
                            </View>
                            <CorruptedMessage visible={error && this.showError} />
                            <ReadReceiptList receipts={this.props.receipts} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

Avatar.propTypes = {
    onPress: React.PropTypes.func,
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
    noTap: React.PropTypes.bool
};

