import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import mainState from '../main/main-state';
import { helpers } from '../../styles/styles';

@observer
export default class MessageIcon extends Component {
    @observable unread = false;
    lastCount = 0;
    componentDidMount() {
        reaction(() => mainState.unreadMessages, count => {
            // console.log(`message-icon.js: unread count ${count}`);
            this.unread = count >= this.lastCount;
            this.lastCount = count;
        });
    }

    press() {
        this.unread = false;
        mainState.toggleLeftMenu();
    }

    render() {
        const dotStyle = {
            left: -4,
            backgroundColor: 'red',
            opacity: this.unread ? 1 : 0
        };

        return (
            <TouchableOpacity onPress={() => this.press()}>
                <View style={{ flexDirection: 'row', paddingLeft: 6, backgroundColor: 'transparent' }}>
                    {icons.plainWhite('menu')}
                    <View style={[helpers.circle(8), dotStyle]} />
                </View>
            </TouchableOpacity>
        );
    }
}
