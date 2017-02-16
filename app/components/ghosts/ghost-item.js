import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import moment from 'moment';
import ghostState from './ghost-state';
import { vars } from '../../styles/styles';

const row = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

const block = {
    padding: 8,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderBottomColor: '#00000020'
};

const normalText = {
    color: vars.txtDark,
    fontSize: 14
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

@observer
export default class GhostItem extends Component {
    press() {
        ghostState.view(this.props.ghost);
    }

    render() {
        const g = this.props.ghost;
        return (
            <TouchableOpacity onPress={() => this.press()}>
                <View style={block}>
                    <View style={row}>
                        <Text style={normalText}>{g.subject}</Text>
                        <Text style={lightText}>{moment(g.timestamp).format('L')}</Text>
                    </View>
                    <Text style={lightText}>{g.recipients.join(', ')}</Text>
                    <Text style={lightText} ellipsizeMode="tail" numberOfLines={1}>{g.preview}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

GhostItem.propTypes = {
    ghost: React.PropTypes.any.isRequired
};
