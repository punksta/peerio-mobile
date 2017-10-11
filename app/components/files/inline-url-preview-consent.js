import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import { t, tx, tu } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import Link from '../controls/link';
import RadioButton from '../controls/radio-button';
import Option from '../controls/radio-button-option';

const container = {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#949494',
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingTop: 21,
    paddingBottom: 6
};

const titleContainer = {
    flexDirection: 'row'
};

const titleText = {
    fontSize: 18,
    color: 'black',
    paddingLeft: 8
};

const radioText = {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 4
};

@observer
export default class InlineUrlPreviewConsent extends SafeComponent {
    constructor(props) {
        super(props);
        this.state = {
            optionSelected: 0
        };
        this.onSelectRadioButton = this.onSelectRadioButton.bind(this);
    }

    onSelectRadioButton(index) {
        this.setState({
            optionSelected: index
        });
        console.log(index);
        console.log(this.state.optionSelected);
    }

    renderButton(text, onPress, colorIsPrimary) {
        return (
            <TouchableOpacity
                onPress={onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingLeft: 40, paddingVertical: 16 }}>
                <Text style={{ fontWeight: 'bold', color: colorIsPrimary ? vars.bg : null }}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }

    userActionSave = () => {
        const index = this.state.optionSelected;
        const settings = User.current.settings.inlineChatContent;
        if (index === 0) { // For all Contacts
            settings.consentExternal = true;
            settings.externalContentEnabled = true;
            settings.externalJustForFavContacts = false;
        } else if (index === 1) { // For favorite contacts only
            settings.consentExternal = true;
            settings.externalContentEnabled = true;
            settings.externalJustForFavContacts = true;
        } else if (index === 2) { // Disable
            settings.consentExternal = false;
            settings.externalContentEnabled = false;
            settings.externalJustForFavContacts = false;
        }
        User.current.saveSettings();
    }

    userActionDismiss() {}

    get spacer() {
        return <View style={{ height: 16 }} />;
    }

    renderThrow() {
        return (
            <View style={container}>
                <View style={titleContainer}>
                    <Icon
                        name="warning"
                        size={vars.iconSize}
                        color="gray"
                    />
                    <Text style={titleText}>
                        {tx('title_EnableUrlPreviews')}
                    </Text>
                </View>
                {this.spacer}
                <Text>
                    {tx('title_UrlPreviewsWarning')}
                </Text>
                <Link>
                    {tx('title_learnMore')}
                </Link>
                {this.spacer}
                {/* TODO Extract Option into RadioButton */}
                <RadioButton
                    onSelect={this.onSelectRadioButton}
                    defaultSelect={this.state.optionSelected}>
                    <Option>
                        <View style={radioText}>
                            <Text>{tx('title_forAllContacts')}</Text>
                        </View>
                    </Option>
                    <Option>
                        <View style={radioText}>
                            <Text>{tx('title_forFavouriteContactsOnly')}</Text>
                        </View>
                    </Option>
                    <Option>
                        <View style={radioText}>
                            <Text>{tx('title_disable')}</Text>
                        </View>
                    </Option>
                </RadioButton>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    {this.renderButton(tu('button_notNow'), this.userActionDismiss, false)}
                    {this.renderButton(tu('button_save'), this.userActionSave, true)}
                </View>
            </View>
        );
    }
}
