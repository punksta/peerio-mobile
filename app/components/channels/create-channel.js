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
import contactState from '../contacts/contact-state';

const fillView = { flex: 1, flexGrow: 1 };

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
        reaction(() => this.step, v => this._scrollView.scrollTo({ x: width * v }));
        reaction(() => this.step, () => LayoutAnimation.easeInEaseOut());
    }

    handleScroll = event => {
        const x = event.nativeEvent.contentOffset.x;
        this.step = Math.round(x / width);
    }

    step2() {
        setTimeout(() => this._scrollView.scrollToEnd(), 0);
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
                {icons.dark('close')}
                <Text style={textStyle}>{'New channel'}</Text>
                {this.isReady ?
                    icons.text(t('button_go'), () => this.step2()) : icons.placeholder()}
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
                    {buttons.uppercaseBlueButton('Create chat', () => this.props.createChat())}
                </View>
            </View>
        );
    }

    get upgradeOffer() {
        const offerStyle = {
            backgroundColor: '#d9f1ef',
            padding: 12
        };
        return (
            <View style={offerStyle}>
                <Text>
                    {`👋 Hi there, basic Peerio accounts have access to`}
                    <Text style={{ fontWeight: 'bold' }}> 2 free channels</Text>, enjoy 1 more channel on this account!
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    {buttons.uppercaseBlueButton('Upgrade')}
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
                    scrollEnabled={this.isValid}
                    scrollEventThrottle={0}
                    showsHorizontalScrollIndicator={false}
                    ref={sv => (this._scrollView = sv)}
                    onScroll={this.handleScroll}
                    key="scroll" horizontal pagingEnabled removeClippedSubviews={false}>
                    <View style={card}>
                        {this.upgradeOffer}
                        {this.renderTextBox('Channel name', '# Name', 'channelName')}
                        {this.renderTextBox('Purpose (optional)', 'What is it about', 'channelPurpose')}
                        <View style={rowCenter2}>
                            {this.isValid && buttons.uppercaseBlueButton('Add users', () => this.step2())}
                        </View>
                    </View>
                    <View style={card}>
                        <ContactSelector hideHeader />
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
