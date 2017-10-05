import React from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { View, Image, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';

const OPTIMAL_WIDTH = 300;
const OPTIMAL_HEIGHT = 200;

@observer
export default class FileInlineImage extends SafeComponent {
    @observable width = 10;
    @observable height = 10;

    componentWillMount() {
        Image.getSize(this.props.image, (width, height) => {

        });
    }

    renderThrow() {
        const { image } = this.props;
        const { width, height } = this;
        const source = { uri: image };
        return (
            <View>
                <Image source={source} style={{ width, height }} />
            </View>
        );
    }
}
