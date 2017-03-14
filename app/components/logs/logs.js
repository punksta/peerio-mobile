import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';

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
