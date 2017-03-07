import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Share from 'react-native-share';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import { tx } from '../utils/translator';
// import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { mailStore } from '../../lib/icebear';

const padding = 8;
const marginVertical = 4;

const row = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

const normalText = {
    color: vars.txtDark,
    fontSize: 12
};

const lightText = {
    color: vars.subtleText,
    fontSize: 12
};

const boldText = {
    fontWeight: 'bold',
    fontSize: 18,
    height: 36
};

const infoBlock = {
    padding,
    borderTopWidth: 1,
    borderTopColor: '#cfcfcf',
    backgroundColor: '#efefef'
};

const textBlock = {
    flex: 1,
    flexGrow: 1,
    padding,
    fontSize: 12,
    marginVertical
};

const filler = {
    flex: 1,
    flexGrow: 1
};

@observer
export default class Ghost extends Component {
    get ghost() {
        return mailStore.selectedGhost;
    }

    share() {
        Share.open({
            title: tx('share_peerioMailTitle'),
            message: this.ghost.passphrase,
            subject: tx('share_peerioMailSubject')
        })
        .catch(() => {
            console.log(`ghost-view.js: share cancelled by user`);
        });
    }

    render() {
        const g = this.ghost;
        if (!g) return null;

        return (
            <View style={filler}>
                <View style={{ padding }}>
                    <Text style={lightText}>Passphrase</Text>
                    <TouchableOpacity
                        pressRetentionOffset={vars.offset}
                        onPress={() => this.share()}>
                        <Text style={boldText}>
                            {g.passphrase}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={infoBlock}>
                    <View style={row}>
                        <Text style={normalText}>Me</Text>
                        <Text style={lightText}>
                            {moment(g.timestamp).format(`LLL`)}
                        </Text>
                    </View>
                    <View style={{ marginVertical }}>
                        <Text style={normalText}>to {g.recipients.join(', ')}</Text>
                    </View>
                    <Text style={normalText}>
                        {g.subject}
                    </Text>
                </View>
                <ScrollView>
                    <TouchableOpacity>
                        <Text style={textBlock} selectable>
                            {g.body}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}
