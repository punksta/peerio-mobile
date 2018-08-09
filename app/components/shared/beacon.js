import PropTypes from 'prop-types';
import React from 'react';
// import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions } from 'react-native';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';

const { height } = Dimensions.get('window');

const container = {
    position: 'absolute'
};

const headerStyle = {

};

const line1 = {

};

const line2 = {

};

const line3 = {

};

@observer
export default class Beacon extends SafeComponent {
    bubbleRadius = 48; // TODO determine Radius based on content

    // Beacon Positions (X,Y):
    // (0,0)    (1,0)   (2,0)   (3,0)
    // (0,1)    (1,1)   (2,1)   (3,1)
    beaconPositionX;
    beaconPositionY;

    get beaconHeight() {
        const { copyHeader, copyLine1, copyLine2, copyLine3 } = this.props;
        let numLines = 0;

        // count number of lines to determine beacon height
        const contentArr = [copyHeader, copyLine1, copyLine2, copyLine3];
        contentArr.forEach((line) => { if (line) numLines++; });

        return (numLines * vars.beaconLineHeight) + (2 * vars.beaconPadding) + (this.bubbleRadius / 2);
    }

    renderThrow() {
        const { positionX, copyHeader, copyLine1, copyLine2, copyLine3 } = this.props;
        const { beaconCoords } = uiState;
        if (!beaconCoords) return null;

        this.beaconPositionX = -vars.beaconWidth * positionX / 3;
        // Set beacon position Y based on whether it is in the upper or lower half of the screen
        this.beaconPositionY = (height / 2 >= beaconCoords.y) ? 0 : -this.beaconHeight;

        this.bubblePadding = vars.beaconPadding + this.bubbleRadius / 2;
        const paddingLeft = positionX === 0 ? this.bubblePadding : vars.beaconPadding;
        const paddingRight = positionX === 3 ? this.bubblePadding : vars.beaconPadding;
        const paddingTop = this.beaconPositionY === 0 ? this.bubblePadding : vars.beaconPadding;
        const paddingBottom = this.beaconPositionY !== 0 ? this.bubblePadding : vars.beaconPadding;

        const outerCircle = {
            position: 'absolute',
            // center the circle
            top: -beaconCoords.height / 2,
            left: -beaconCoords.width / 2,
            width: this.bubbleRadius,
            height: this.bubbleRadius,
            borderRadius: this.bubbleRadius / 2,
            borderColor: vars.beaconBg,
            borderWidth: vars.beaconBorderWidth
        };

        const innerCircle = {
            backgroundColor: 'white',
            borderRadius: this.bubbleRadius / 2,
            width: this.bubbleRadius - 2 * vars.beaconBorderWidth,
            height: this.bubbleRadius - 2 * vars.beaconBorderWidth
        };

        const rectangle = {
            position: 'absolute',
            top: -beaconCoords.height / 2 + this.bubbleRadius / 2 + this.beaconPositionY,
            left: -beaconCoords.width / 2 + this.bubbleRadius / 2 + this.beaconPositionX,
            width: vars.beaconWidth,
            height: this.beaconHeight,
            backgroundColor: vars.beaconBg,
            borderRadius: 8,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom
        };
        return (
            <View style={[container, { left: beaconCoords.x, top: beaconCoords.y }]}>
                <View style={rectangle}>
                    <Text bold style={headerStyle}>{copyHeader}</Text>
                    <Text semibold={!copyLine3 || !copyHeader} style={line1}>{copyLine1}</Text>
                    <Text semibold={!copyLine3 || !copyHeader} style={line2}>{copyLine2}</Text>
                    <Text style={line3}>{copyLine3}</Text>
                </View>
                <View style={outerCircle}>
                    <View style={innerCircle} />{/* Replace with mock content */}
                </View>
            </View>
        );
    }
}

Beacon.propTypes = {
    positionX: PropTypes.any.isRequired,
    copyHeader: PropTypes.any,
    copyLine1: PropTypes.any,
    copyLine2: PropTypes.any,
    copyLine3: PropTypes.any
};
