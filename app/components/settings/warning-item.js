import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { icons } from '../helpers/icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical / 2,
    paddingHorizontal: vars.listViewPaddingHorizontal
};

@observer
export default class WarningItem extends SafeComponent {
    renderThrow() {
        return (
            <View style={bgStyle}>
                <Icon
                        style={{ paddingRight: 4, marginLeft: 8 }}
                        name="warning"
                        size={vars.iconSize}
                        color="white"
                    />
                {/* icons.plain('warning', vars.iconSize, 'white') */}
                <Text>
                    {this.props.content}
                </Text>
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

