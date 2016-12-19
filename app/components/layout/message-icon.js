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
            top: -8,
            backgroundColor: '#d0021b',
            opacity: this.unread ? 1 : 0
        };

        return (
            <TouchableOpacity onPress={() => this.press()}>
                <View style={{
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginRight: 16,
                    paddingLeft: 16,
                    width: 56,
                    height: 56
                }}>
                    {icons.plainWhite('menu')}
                    <View style={[helpers.circle(10), dotStyle]} />
                </View>
            </TouchableOpacity>
        );
    }
}
