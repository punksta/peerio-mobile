import React, { Component } from 'react';
import {
    View, Image, Dimensions, PixelRatio
} from 'react-native';

const bg = require('../../assets/bg-pattern.png');

const ratio = PixelRatio.get();
const origRatio = 8;
const origWidth = 1000;
const origHeight = 1000;
const scaledWidth = origWidth * ratio / origRatio;
const scaledHeight = origHeight * ratio / origRatio;
const { width, height } = Dimensions.get('window');

export default class BgPattern extends Component {
    tile(j) {
        return (
            <Image key={j} testID="bg" style={{ height: scaledHeight, width: scaledWidth }} source={bg} />
        );
    }

    render() {
        const items = [];
        for (let i = 0; i < (height / scaledHeight); ++i) {
            const row = [];
            for (let j = 0; j < (width / scaledWidth); ++j) {
                row.push(this.tile(j));
            }
            items.push(
                <View key={`${i}`} style={{ flexDirection: 'row' }}>
                    {row}
                </View>
            );
        }
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {items}
            </View>
        );
    }
}
