import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';
import SafeComponent from '../shared/safe-component';

@observer
export default class UpdateProgressIndicator extends SafeComponent {
    renderThrow() {
        return (
            <View>
                <Text>{this.props.progress}%</Text>
            </View>
        );
    }
}

UpdateProgressIndicator.propTypes = {
    progress: PropTypes.any
};
