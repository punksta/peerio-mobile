import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import UpdateProgressIndicator from '../controls/update-progress-indicator';
import { fileStore } from '../../lib/icebear';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class PopupMigration extends SafeComponent {
    get indicator() {
        return fileStore.migrationPerformedByAnotherClient ? (
            <ActivityIndicator size="large" style={{ margin: 40 }} />
        ) : (
            <UpdateProgressIndicator progress={fileStore.migrationProgress} />
        );
    }
    renderThrow() {
        const textStyle = {
            color: vars.black,
            fontSize: vars.font.size.smaller,
            textAlign: 'center'
        };
        return (
            <View>
                {this.indicator}
                <Text style={textStyle}>{tx('title_fileUpdateProgressDescription')}</Text>
            </View>
        );
    }
}

PopupMigration.propTypes = {
    progress: PropTypes.any
};
