import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import mainState from '../main/main-state';

@observer
export default class Logs extends Component {

    render() {
        const items = console.stack.map((i, k) => (
            <TouchableOpacity key={k}>
                <Text>{i ? JSON.stringify(i) : null}</Text>
            </TouchableOpacity>
        ));
        return (
            <View style={{ flexGrow: 1 }}>
                <ScrollView>
                    {items}
                </ScrollView>
            </View>
        );
    }
}
