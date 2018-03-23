import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import UpdateProgressIndicator from '../controls/update-progress-indicator';
import uiState from '../layout/ui-state';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class PopupMigration extends SafeComponent {
    renderThrow() {
        const textStyle = {
            color: vars.black,
            fontSize: vars.font.size.smaller,
            textAlign: 'center'
        };
        return (
            <View>
                <UpdateProgressIndicator progress={uiState.fileUpdateProgress} />
                <Text style={textStyle}>{tx('title_fileUpdateProgressDescription')}</Text>
            </View>
        );
    }
}

PopupMigration.propTypes = {
    progress: PropTypes.any
};
