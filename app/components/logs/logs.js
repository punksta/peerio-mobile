import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    NativeModules,
    Alert
} from 'react-native';
import stringify from 'json-stringify-safe';
import moment from 'moment';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';

const { RNMail } = NativeModules;

const mapFormat = ({ time, msg }) => ({
    msg: msg && (typeof msg === 'string' ? msg : stringify(msg)),
    time: moment(time).format('HH:mm:ss.SSS Z')
});

const mapGlue = ({ msg, time }) => `${time}: ${msg}`;

export default class Logs extends Component {
    sendLogs() {
        const subject = `Peerio Support // logs from ${User.current.username}`;
        const recipients = ['support@peerio.com'];
        const body = `<pre>${console.stack.map(mapFormat).map(mapGlue).join('\n')}</pre>`;
        RNMail.mail(
            { subject, recipients, body, isHTML: true },
            (error) => error && Alert.alert('Error sending logs', error)
        );
    }

    sendButton() {
        const outer = {
            position: 'absolute',
            right: 40,
            bottom: 40
        };
        const s = {
            padding: 30,
            opacity: 0.9,
            backgroundColor: vars.fabEnabled,
            borderRadius: 14
        };
        return (
            <View style={outer}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={() => this.sendLogs()}>
                    <View style={s}>
                        <Text style={{ color: 'white' }}>Send Logs</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const items = console.stack.map(mapFormat).map(({ time, msg }, k) => (
            <Text key={`${time}${k}`}>
                <Text style={{ color: '#666666' }}>{time}</Text>
                {': '}
                {msg}
            </Text>
        ));
        return (
            <View style={{ flexGrow: 1 }}>
                <ScrollView>
                    {items}
                </ScrollView>
                {this.sendButton()}
            </View>
        );
    }
}
