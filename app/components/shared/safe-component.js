import React, { Component } from 'react';
import { Text } from 'react-native';
import { observer } from 'mobx-react/native';

@observer
export default class SafeComponent extends Component {
    renderThrow() {
        throw new Error('Must override SafeComponent: renderThrow');
    }

    errorText(err) {
        let t = 'Error rendering component\n';
        try {
            t += `${this.constructor.name}\n`;
        } catch (e) {
            t += `Error getting object name\n`;
        }
        try {
            t += JSON.stringify(err);
        } catch (e) {
            t += `Error getting exception text\n`;
        }
        return <Text>{t}</Text>;
    }

    render() {
        try {
            return this.renderThrow();
        } catch (e) {
            return this.errorText(e);
        }
    }
}
