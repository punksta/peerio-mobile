import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, LayoutAnimation } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import ContactSelector from '../contacts/contact-selector';
import { t, tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import SimpleTextBox from '../shared/simple-text-box';
import ChannelUpgradeOffer from './channel-upgrade-offer';
import contactState from '../contacts/contact-state';
import chatState from '../messaging/chat-state';

const fillView = { flex: 1, flexGrow: 1, backgroundColor: vars.white };

const rowCenter = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: vars.lightGrayBg
};

const rowCenter2 = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
};

const bottomRowText = {
    flexShrink: 1,
    flex: 1,
    color: vars.txtDate,
    fontSize: 12,
    marginHorizontal: 16
};

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
};

const textinput = {
    fontSize: 14,
    height: vars.inputHeight,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1
};

const label = {
    color: vars.txtDate,
    marginVertical: 4,
    marginLeft: 10
};

const { width } = Dimensions.get('window');

const card = {
    width,
    backgroundColor: vars.lightGrayBg
};

@observer
export default class CreateChannel extends Component {
    @observable channelName = '';
    @observable channelPurpose = '';
    @observable step = 0;

    componentDidMount() {
        reaction(() => this.step, v => {
            this._disableScrollUpdate = true;
            setTimeout(() => this._scrollView.scrollToEnd(), 0);
        });
        reaction(() => this.step, () => LayoutAnimation.easeInEaseOut());
    }

    next() {
        if (this.step === 0) {
            this.step = 1;
        } else {
            this._contactSelector.action();
        }
    }

    get isValid() {
        return this.channelName.trim().length > 0;
    }

    get isReady() {
        return this.isValid && contactState.recipients.length;
    }

    get exitRow() {
        const container = {
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            paddingTop: vars.statusBarHeight * 2,
            paddingBottom: 0
        };
        const textStyle = {
            flexGrow: 1,
            flexShrink: 1,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: vars.font.weight.semiBold,
            color: 'rgba(0, 0, 0, .54)'
        };
        return (
            <View style={container}>
                {icons.dark('close', () => chatState.routerModal.discard())}
                <Text style={textStyle}>{'New channel'}</Text>
                {this.isValid ?
                    icons.text(t('button_go'), () => this.next()) : icons.placeholder()}
            </View>
        );
    }

    get createChatRow() {
        const hideStyle = {
            height: this.step > 0 ? 0 : 60,
            overflow: 'hidden'
        };
        return (
            <View style={hideStyle}>
                <View style={[rowCenter, { height: 60 }]}>
                    <Text numberOfLines={2} style={bottomRowText}>{`Don't need a channel? Use chat instead`}</Text>
                    {buttons.uppercaseBlueButton('Create chat', () => chatState.routerModal.compose())}
                </View>
            </View>
        );
    }

    renderTextBox(labelText, placeholderText, property) {
        return (
            <View style={{ margin: 8 }}>
                <Text style={label}>{tx(labelText)}</Text>
                <View style={textinputContainer}>
                    <SimpleTextBox
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={text => (this[property] = text)}
                        placeholder={tx(placeholderText)} style={textinput}
                        value={this[property]} />
                </View>
                {this.validationError}
            </View>
        );
    }

    render() {
        return (
            <View style={fillView}>
                {this.exitRow}
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={sv => (this._scrollView = sv)}
                    key="scroll" horizontal pagingEnabled removeClippedSubviews={false}>
                    <View style={card}>
                        <ChannelUpgradeOffer />
                        {this.renderTextBox('Channel name', '# Name', 'channelName')}
                        {this.renderTextBox('Purpose (optional)', 'What is it about', 'channelPurpose')}
                    </View>
                    <View style={card}>
                        <ContactSelector
                            action={async contacts => {
                                await chatState.startChat(contacts, true, this.channelName, this.channelPurpose);
                                chatState.routerModal.discard();
                            }}
                            hideHeader ref={ref => (this._contactSelector = ref)} />
                    </View>
                </ScrollView>
                {this.createChatRow}
            </View>
        );
    }
}

CreateChannel.propTypes = {
    createChat: PropTypes.any
};
