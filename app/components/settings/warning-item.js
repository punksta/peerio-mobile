import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Link from '../controls/link';

const container = {
    marginHorizontal: vars.spacing.huge,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vars.spacing.bigger
};

const textStyle = {
    overflow: 'hidden'
};

@observer
export default class WarningItem extends SafeComponent {
    renderThrow() {
        return (
            <View style={container}>
                <Icon
                    style={{ paddingHorizontal: vars.spacing.large }}
                    name="warning"
                    size={vars.iconSize}
                    color="gray"
                    />
                <View style={textStyle}>
                    <Text>
                        {this.props.content}
                    </Text>
                    <Link>
                        {this.props.linkContent}
                    </Link>
                </View>
            </View>
        );
    }
}

WarningItem.propTypes = {
    icon: PropTypes.any,
    content: PropTypes.any,
    linkContent: PropTypes.any,
    link: PropTypes.any
};
