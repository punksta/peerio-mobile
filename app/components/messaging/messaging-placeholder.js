import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeComponent from '../shared/safe-component';
import Bold from '../controls/bold';
import { T } from '../utils/translator';
import BgPattern from '../controls/bg-pattern';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';

@observer
export default class MessagingPlaceholder extends SafeComponent {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
    }

    messaging() {
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
            margin: vars.spacing.medium.midi2x,
            padding: vars.spacing.medium.midi2x,
            backgroundColor: 'white'
        };
        const title = {
            fontWeight: 'bold',
            fontSize: vars.font.size.bigger,
            marginBottom: vars.spacing.small.midi2x
        };

        const textParser = {
            emphasis: () => <Bold>hi</Bold>,
            plusIcon: () => (
                <Icon name="add" />
            )
        };

        return (
            <View style={outerContainerStyle}>
                <BgPattern />
                <View style={inpagePopupStyle}>
                    <Text {...testLabel('title_welcomeHeading')} style={title}><T k="title_welcomeHeading" /></Text>
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
