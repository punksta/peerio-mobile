import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, Dimensions, Image } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { T } from '../utils/translator';
import BgPattern from '../controls/bg-pattern';
import { vars } from '../../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

@observer
export default class MessagingPlaceholder extends SafeComponent {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
    }

    messaging() {
        const headerStyle = {
            flexGrow: 1,
            textAlign: 'center',
            fontSize: 24
        };
        const infoStyle = {
            flexShrink: 1,
            textAlign: 'left',
            fontSize: 16,
            height: 48
        };
        const outerContainerStyle = {
            flex: 1,
            flexGrow: 1,
            alignItems: 'stretch'
        };

        const inpagePopupStyle = {
            justifyContent: 'center',
            borderRadius: 8,
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: {
                height: 1,
                width: 1
            },
            elevation: 10,
            margin: 20,
            padding: 20,
            backgroundColor: 'white'
        };
        const title = {
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: 8
        };

        const textParser = {
            emphasis: text => <Bold>{"hi"}</Bold>,
            plusIcon: text => (
                <Icon name="add" />
            )
        };

        return (
            <View style={outerContainerStyle}>
                <BgPattern />
                <View style={inpagePopupStyle}>
                    <Text style={title}><T k="title_welcomeHeading"></T></Text>
                    <T k="dialog_chatZeroState">{textParser}</T>
                </View>
            </View>
        );
    }

    renderThrow() {
        const s = {
            flex: 1,
            flexGrow: 1,
            justifyContent: 'space-between'
        };
        return (
            <View style={s}>
                {this.messaging()}
            </View>
        );
    }
}
