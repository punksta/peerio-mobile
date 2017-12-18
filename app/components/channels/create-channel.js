import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, LayoutAnimation, TextInput } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import ContactSelector from '../contacts/contact-selector';
import { t, tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import ChannelUpgradeOffer from './channel-upgrade-offer';
import chatState from '../messaging/chat-state';
import { User, config, socket } from '../../lib/icebear';
import SnackBarConnection from '../snackbars/snackbar-connection';

const fillView = { flex: 1, flexGrow: 1, backgroundColor: vars.white };

const { width } = Dimensions.get('window');

const card = {
    width,
    backgroundColor: vars.white,
    flexGrow: 1
};

@observer
export default class CreateChannel extends Component {
    @observable channelName = '';
    @observable channelPurpose = '';
    @observable step = 0;
    @observable inProgress = false;

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
            if (this.inProgress) return;
            this._contactSelector.action();
        }
    }

    get isValid() {
        return this.channelName.trim().length > 0
            && this.channelName.trim().length <= config.chat.maxChatNameLength
            && socket.authenticated
            && !this.inProgress;
    }

    nextIcon() {
        if (this.step === 1) return icons.text(t('button_go'), () => this.next());
        return icons.text(t('button_next'), () => this.next());
    }

    nextIconDisabled() {
        if (this.step === 1) return icons.disabledText(t('button_go'));
        return icons.disabledText(t('button_next'));
    }

    get exitRow() {
        const container = {
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: vars.statusBarHeight * 2,
            paddingBottom: 0
        };
        const textStyle = {
            textAlign: 'center',
            flexGrow: 1,
            flexShrink: 1,
            fontSize: vars.font.size.huge,
            fontWeight: vars.font.weight.semiBold,
            color: vars.txtDark
        };
        return (
            <View style={container}>
                {icons.dark('close', () => chatState.routerModal.discard())}
                <Text style={textStyle}>{tx('button_createChannel')}</Text>
                {this.isValid ? this.nextIcon() : this.nextIconDisabled()}
            </View>
        );
    }

    renderTextBox(labelText, placeholderText, property, bottomText) {
        const height = vars.inputHeight;
        const container = {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: vars.spacing.medium.maxi,
            marginHorizontal: vars.spacing.medium.mini2x,
            marginVertical: vars.spacing.small.midi,
            borderColor: vars.bg,
            borderWidth: 1,
            height,
            borderRadius: height
        };
        const titleStyle = {
            color: vars.bg,
            fontSize: vars.font.size.bigger
        };
        const placeholderStyle = {
            flexGrow: 1,
            height,
            marginLeft: vars.spacing.small.midi,
            fontSize: vars.font.size.normal
        };
        const bottomTextStyle = {
            fontSize: vars.font.size.smaller,
            color: vars.txtDate,
            marginLeft: vars.spacing.large.midixx,
            marginBottom: vars.spacing.medium.mini2x
        };

        return (
            <View>
                <View style={container}>
                    <Text style={titleStyle}>{tx(labelText)}</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        value={this.findUserText}
                        returnKeyType="done"
                        blurOnSubmit
                        onChangeText={text => { this[property] = text; }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder={tx(placeholderText)}
                        ref={ti => { this.textInput = ti; }}
                        style={placeholderStyle}
                        maxLength={config.chat.maxChatNameLength} />
                </View>
                <Text style={bottomTextStyle}>{tx(bottomText)}</Text>
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
                    {this.exitRow}
                    <ChannelUpgradeOffer />
                    {this.renderTextBox(
                        tx('title_channelName'),
                        tx('title_channelNamePlaceholder'),
                        'channelName',
                        tx('title_channelNameLimit', { maxChatNameLength: config.chat.maxChatNameLength })
                    )}
                    {this.renderTextBox(
                        tx('title_channelTopic'),
                        tx('title_channelTopicPlaceholder'),
                        'channelPurpose',
                        tx('title_channelTopicOptional')
                    )}
                </View>
                <View style={card}>
                    {this.exitRow}
                    <ContactSelector
                        action={async contacts => {
                            this.inProgress = true;
                            await chatState.startChat(contacts, true, this.channelName, this.channelPurpose);
                            chatState.routerModal.discard();
                        }}
                        hideHeader ref={ref => { this._contactSelector = ref; }}
                        inputPlaceholder="title_roomParticipants" />
                </View>
            </ScrollView>
        );
    }

    get paywall() {
        return <View style={card}><ChannelUpgradeOffer /></View>;
    }

    render() {
        return (
            <View style={fillView} contentContainerStyle={fillView}>
                {User.current.channelsLeft <= 0 ? this.paywall : this.scrollView}
                <SnackBarConnection />
            </View>
        );
    }
}

CreateChannel.propTypes = {
    createChat: PropTypes.any
};
