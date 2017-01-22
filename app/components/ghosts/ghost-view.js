import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import mainState from '../main/main-state';

@observer
export default class Ghost extends Component {

    render() {
        return (
            <View>
                <Text>ghost view</Text>
            </View>
        );
    }
}
