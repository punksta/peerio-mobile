import React, { Component } from 'react';
import {
    View, ScrollView, Text, TextInput
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import { User, contactStore } from '../../lib/icebear';
import { t, tx } from '../utils/translator';

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: 4
};

const textinput = {
    height: vars.inputHeight,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft
};

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    backgroundColor: 'red',
    borderColor: 'yellow',
    borderWidth: 4
};

const flexRow = {
    flexDirection: 'row',
    flex: 0,
    flexGrow: 1,
    alignItems: 'center'
};

@observer
export default class ProfileEdit extends Component {
    @observable firstName;
    @observable lastName;

    componentDidMount() {
        const { firstName, lastName } = User.current;
        Object.assign(this, { firstName, lastName });
    }

    submit = () => {
        const user = User.current;
        const { firstName, lastName } = user;
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        User.current.saveProfile().catch(() => {
            Object.assign(user, { firstName, lastName });
        });
    }

    saveLastName = (val) => {
        const prev = User.current.lastName;
        User.current.lastName = val;
        User.current.saveProfile().catch(() => {
            User.current.lastName = prev;
        });
    }

    render() {
        const contact = contactStore.getContact(User.current.username);
        const { firstName, lastName, fingerprintSkylarFormatted, username } = contact;
        return (
            <ScrollView style={{ backgroundColor: vars.settingsBg }}>
                <View style={[flexRow, { backgroundColor: contact.color }]}>
                    <Text style={{
                        color: vars.white,
                        fontWeight: 'bold',
                        fontSize: 60,
                        marginHorizontal: 24,
                        marginVertical: 16
                    }}>
                        {contact.letter}
                    </Text>
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={2}
                            style={{
                                fontWeight: 'bold',
                                color: vars.white,
                                fontSize: 16,
                                marginVertical: 4
                            }}>{firstName} {lastName}</Text>
                        <Text style={{ color: vars.white }}>@{username}</Text>
                    </View>
                </View>
                <View style={{ margin: 24 }}>
                    <View style={textinputContainer}>
                        <TextInput
                            onBlur={this.submit}
                            onChangeText={text => (this.firstName = text)}
                            placeholder={tx('title_firstName')} style={textinput} value={this.firstName} />
                    </View>
                    <View style={textinputContainer}>
                        <TextInput
                            onBlur={this.submit}
                            onChangeText={text => (this.lastName = text)}
                            placeholder={tx('title_lastName')} style={textinput} value={this.lastName} />
                    </View>
                </View>
                <View style={{ margin: 24 }}>
                    <Text style={{ color: vars.txtDate, marginVertical: 10 }}>{t('title_publicKey')}</Text>
                    <Text style={{ color: vars.txtMedium, fontFamily: `Verdana`, fontSize: 16 }} numberOfLines={2}>
                        {fingerprintSkylarFormatted}
                    </Text>
                </View>
            </ScrollView>
        );
    }
}
