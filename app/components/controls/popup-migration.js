import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import AlternatingText from '../controls/alternating-text';
import { fileStore } from '../../lib/icebear';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import Text from '../controls/custom-text';
import Progress from '../shared/progress';

const messageArray = [
    {
        message: tx('title_migrationInProgressMessage1')
    },
    {
        message: tx('title_migrationInProgressMessage2')
    },
    {
        message: tx('title_migrationInProgressMessage3'),
        emoji: '\uD83D\uDE38' // Grinning cat
    },
    {
        message: tx('title_migrationInProgressMessage4')
    },
    {
        message: tx('title_migrationInProgressMessage5a'),
        messageB: tx('title_migrationInProgressMessage5b'),
        emoji: '\uD83D\uDCAA' // Muscle
    },
    {
        message: tx('title_migrationInProgressMessage6')
    },
    {
        message: tx('title_migrationInProgressMessage7')
    },
    // Skip message 8 because its for desktop
    {
        message: tx('title_migrationInProgressMessage9')
    },
    {
        message: tx('title_migrationInProgressMessage10')
    }
];

const container = {
    justifyContent: 'center',
    marginTop: vars.spacing.huge.mini,
    marginBottom: vars.spacing.large.mini2x
};

const textStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    marginTop: vars.spacing.small.midi2x
};

@observer
export default class PopupMigration extends SafeComponent {
    get indicator() {
        return fileStore.migration.performedByAnotherClient ? (
            <ActivityIndicator size="large" style={{ margin: 40 }} />
        ) : (
            <View style={container}>
                <Progress max={100} value={fileStore.migration.progress} />
                {(fileStore.migration.progress !== 0) && <Text style={textStyle}>{tx('title_fileUpdateProgressPercent', { progress: fileStore.migration.progress })}</Text>}
            </View>
        );
    }

    renderThrow() {
        const alternatingTextStyle = {
            color: vars.black,
            fontSize: vars.font.size.smaller,
            textAlign: 'center'
        };
        return (
            <View>
                {this.indicator}
                <AlternatingText
                    initialText={tx('title_fileUpdateProgressDescription')}
                    messageArray={messageArray}
                    textStyle={alternatingTextStyle} />
            </View>
        );
    }
}

PopupMigration.propTypes = {
    progress: PropTypes.any
};
