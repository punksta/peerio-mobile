import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import UpdateProgressIndicator from '../controls/update-progress-indicator';
import AlternatingText from '../controls/alternating-text';
import { fileStore } from '../../lib/icebear';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class PopupMigration extends SafeComponent {
    get indicator() {
        return fileStore.migration.performedByAnotherClient ? (
            <ActivityIndicator size="large" style={{ margin: 40 }} />
        ) : (
            <UpdateProgressIndicator progress={fileStore.migration.progress} />
        );
    }
    renderThrow() {
        const randomMessageArray = [
            // TODO waiting for copy
        ];
        const textStyle = {
            color: vars.black,
            fontSize: vars.font.size.smaller,
            textAlign: 'center'
        };
        return (
            <View>
                {this.indicator}
                <AlternatingText
                    initialText={tx('title_fileUpdateProgressDescription')}
                    textArray={randomMessageArray}
                    textStyle={textStyle} />
            </View>
        );
    }
}

PopupMigration.propTypes = {
    progress: PropTypes.any
};
