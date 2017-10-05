import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';

@observer
export default class FileInlineImage extends SafeComponent {
    renderThrow() {
        const { image } = this.props;
        const source = { uri: image };
        return (
            <View>
                <Text>{image}</Text>
                <Image source={source} style={{ width: 100, height: 100 }} />
            </View>
        );
    }
}
