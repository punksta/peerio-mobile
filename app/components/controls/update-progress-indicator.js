import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import Text from '../controls/custom-text';

const OUTER_HEIGHT = 80;
const OUTER_WIDTH = OUTER_HEIGHT;
const OUTER_RADIUS = OUTER_HEIGHT / 2;
const INNER_HEIGHT = 64;
const INNER_WIDTH = INNER_HEIGHT;
const INNER_RADIUS = INNER_HEIGHT / 2;

const container = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: OUTER_HEIGHT,
    marginTop: vars.spacing.huge.minixx,
    marginBottom: vars.spacing.medium.maxi
};
const outerCircle = {
    position: 'absolute',
    height: OUTER_HEIGHT,
    width: OUTER_WIDTH,
    borderRadius: OUTER_RADIUS,
    backgroundColor: vars.peerioBlue,
    zIndex: 10
};
const progressContainer = {
    height: OUTER_HEIGHT,
    width: OUTER_WIDTH,
    zIndex: 11
};
const innerCircle = {
    position: 'absolute',
    height: INNER_HEIGHT,
    width: INNER_WIDTH,
    borderRadius: INNER_RADIUS,
    backgroundColor: vars.white,
    zIndex: 12
};
const textStyle = {
    position: 'absolute',
    zIndex: 13,
    color: vars.lighterBlackText
};

@observer
export default class UpdateProgressIndicator extends SafeComponent {
    renderThrow() {
        const { progress } = this.props;
        const fill = OUTER_WIDTH - (progress / 100 * OUTER_WIDTH);
        const progressFiller = {
            position: 'absolute',
            right: 0,
            height: OUTER_HEIGHT,
            backgroundColor: vars.white,
            width: fill,
            zIndex: 11
        };
        return (
            <View style={container} >
                <View style={outerCircle} />
                <View style={innerCircle} />
                <View style={progressContainer}>
                    <View style={progressFiller} />
                </View>
                <Text style={textStyle}>{tx('title_fileUpdateProgressPercent', { progress })}</Text>
            </View>
        );
    }
}

UpdateProgressIndicator.propTypes = {
    progress: PropTypes.any
};
