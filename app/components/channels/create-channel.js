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
import { User } from '../../lib/icebear';

const fillView = { flex: 1, flexGrow: 1, backgroundColor: vars.white };

const rowCenter = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: vars.channels.rowCenterPadding,
    borderTopWidth: 1,
    borderTopColor: vars.lightGrayBg
};

const bottomRowText = {
    flexShrink: 1,
    flex: 1,
    color: vars.txtDate,
    fontSize: vars.font.size.smaller,
    marginHorizontal: vars.channels.marginH
};

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: vars.channels.textInput.marginB,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
};

const textinput = {
    fontSize: vars.font.size.normal,
    height: vars.inputHeight,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1
};

const label = {
    color: vars.txtDate,
    marginVertical: vars.channels.label.marginV,
    marginLeft: vars.channels.label.marginL
};

const { width } = Dimensions.get('window');

const card = {
    width,
    backgroundColor: vars.lightGrayBg,
    flexGrow: 1
};

@observer
export default class CreateChannel extends Component {
    @observable channelName = '';
    @observable channelPurpose = '';
    @observable step = 0;

    componentDidMount() {
        reaction(() => this.step, () => {
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
            padding: vars.channels.exitRow.padding,
            paddingTop: vars.statusBarHeight * 2,
            paddingBottom: 0
        };
        const textStyle = {
            flexGrow: 1,
            flexShrink: 1,
            textAlign: 'center',
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.semiBold,
            color: 'rgba(0, 0, 0, .54)'
        };
        return (
            <View style={container}>
                {icons.dark('close', () => chatState.routerModal.discard())}
                <Text style={textStyle}>{tx('button_createChannel')}</Text>
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
                    <Text numberOfLines={2} style={bottomRowText}>{tx('title_goCreateChat')}</Text>
                    {buttons.uppercaseBlueButton(tx('button_createChat'), () => chatState.routerModal.compose())}
                </View>
            </View>
        );
    }

    renderTextBox(labelText, placeholderText, property) {
        return (
            <View style={{ margin: vars.channels.renderTextBoxMargin }}>
                <Text style={label}>{tx(labelText)}</Text>
                <View style={textinputContainer}>
                    <SimpleTextBox
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={text => { this[property] = text; }}
                        placeholder={tx(placeholderText)} style={textinput}
                        value={this[property]} />
                </View>
                {this.validationError}
            </View>
        );
    }

    get scrollView() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                ref={sv => { this._scrollView = sv; }}
                key="scroll" horizontal pagingEnabled removeClippedSubviews={false}>
                <View style={card}>
                    <ChannelUpgradeOffer />
                    {this.renderTextBox(tx('title_channelName'), tx('title_channelNamePlaceholder'), 'channelName')}
                    {this.renderTextBox(tx('title_channelPurpose'), tx('title_channelPurposePlaceholder'), 'channelPurpose')}
                </View>
                <View style={card}>
                    <ContactSelector
                        action={async contacts => {
                            await chatState.startChat(contacts, true, this.channelName, this.channelPurpose);
                            chatState.routerModal.discard();
                        }}
                        hideHeader ref={ref => { this._contactSelector = ref; }} />
                </View>
            </ScrollView>
        );
    }

    get paywall() {
        return <View style={card}><ChannelUpgradeOffer /></View>;
    }

    render() {
        return (
            <ScrollView keyboardShouldPersistTaps={this.step > 0 ? 'handled' : 'never'} scrollEnabled={false} style={fillView} contentContainerStyle={fillView}>
                {this.exitRow}
                {User.current.channelsLeft <= 0 ? this.paywall : this.scrollView}
            </ScrollView>
        );
    }
}

CreateChannel.propTypes = {
    createChat: PropTypes.any
};
