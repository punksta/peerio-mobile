import PropTypes from 'prop-types';
import React from 'react';
import { View, Image, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

const square = {
    height: 128,
    width: 128
};

const inner = {
    backgroundColor: vars.lightGrayBg,
    borderRadius: 4
};

const innerDark = {
    backgroundColor: '#9d9d9d',
    borderRadius: 4
};

const innerLeft = {
    marginRight: 15
};

const imageNumContainer = {
    justifyContent: 'center',
    alignItems: 'center'
};

const imageNumText = {
    fontSize: 24,
    fontWeight: '600',
    color: 'white'
};

export default class FileMultiInlineImageContainer extends SafeComponent {
    dualImageRow(isTopRow, moreThanFour = false) {
        const bottomRow = {
            flexDirection: 'row',
            marginTop: isTopRow ? 0 : 8
        };

        let firstIndex, secondIndex;
        if (isTopRow) {
            firstIndex = 0;
            secondIndex = 1;
        } else {
            firstIndex = 2;
            secondIndex = 3;
        }

        const { cachedImages } = this.props;

        return (
            <View style={bottomRow}>
                <View style={[inner, innerLeft]}>
                    <Image
                        source={cachedImages[firstIndex].source || {}}
                        style={square}
                    />
                </View>
                {moreThanFour ?
                    <View style={[innerDark, square, imageNumContainer]}>
                        <Text style={imageNumText}>
                            +{cachedImages.length - 4}
                        </Text>
                    </View>
                :
                    <View style={inner}>
                        <Image
                            source={cachedImages[secondIndex].source || {}}
                            style={square}
                        />
                    </View>}
            </View>
        );
    }

    singleImageRow() {
        const { cachedImages } = this.props;

        return (
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View style={[inner, innerLeft]}>
                    <Image
                        source={cachedImages[2].source || {}}
                        style={square}
                    />
                </View>
            </View>
        );
    }

    render() {
        const { cachedImages } = this.props;

        const imageCount = cachedImages.length;
        if (imageCount === 2) {
            return this.dualImageRow(true);
        } else if (imageCount === 3) {
            return (
                <View>
                    {this.dualImageRow(true)}
                    {this.singleImageRow()}
                </View>
            );
        } else if (imageCount === 4) {
            return (
                <View>
                    {this.dualImageRow(true)}
                    {this.dualImageRow(false)}
                </View>
            );
        }
        return (
            <View>
                {this.dualImageRow(true)}
                {this.dualImageRow(false, true)}
            </View>
        );
    }
}
