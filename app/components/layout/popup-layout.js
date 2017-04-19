import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import popupState from './popup-state';
import ButtonText from '../controls/button-text';
import { vars } from '../../styles/styles';

@observer
export default class PopupLayout extends Component {
    constructor(props) {
        super(props);
        this.button = this.button.bind(this);
    }

    onPress(item) {
        item.action && item.action();
        popupState.discardPopup();
    }

    button(item) {
        const { text, id, secondary } = item;
        return (
            <ButtonText
                testID={`popupButton_${id}`}
                onPress={() => this.onPress(item)}
                secondary={secondary}
                key={id}
                text={text} />
        );
    }

    render() {
        const popup = popupState.activePopup;
        if (!popup) return null;

        const modalStyle = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };

        const popupNonAnimatedStyle = [modalStyle, {
            justifyContent: 'center',
            backgroundColor: '#00000020',
            transform: [{ translateY: 0 }]
        }];

        const container = {
            flexGrow: popup.fullScreen,
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: {
                height: 1,
                width: 1
            },
            margin: 20,
            backgroundColor: 'white'
        };

        const title = {
            fontWeight: 'bold',
            fontSize: 16
        };

        const buttonBar = {
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'flex-end'
        };

        return (
            <View style={popupNonAnimatedStyle}>
                <View style={container}>
                    <View style={{ padding: 20, flexGrow: 1, flexShrink: 1 }}>
                        <Text style={title}>{popup.title}</Text>
                        {popup.subTitle}
                        {popup.contents}
                    </View>
                    <View style={buttonBar}>
                        {popup.buttons.map(this.button)}
                    </View>
                </View>
            </View>
        );
    }
}

PopupLayout.propTypes = {
};
