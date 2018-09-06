import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Dimensions, Image } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import ViewWithDrawer from '../shared/view-with-drawer';
import testLabel from '../helpers/test-label';

const fileUploadZeroState = require('../../assets/file-upload-zero-state.png');

@observer
export default class FilesPlaceholder extends SafeComponent {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
    }

    renderThrow() {
        const outerContainer = {
            flexShrink: 1,
            width: this.width,
            justifyContent: 'center',
            marginTop: vars.spacing.medium.maxi
        };
        const imageStyle = {
            width: this.width,
            height: 275,
            marginVertical: vars.spacing.huge.midi
        };
        const headerStyle = {
            color: vars.textBlack54,
            textAlign: 'center',
            fontSize: vars.font.size.huge
        };
        return (
            <ViewWithDrawer>
                <View style={outerContainer}>
                    <Image
                        source={fileUploadZeroState}
                        resizeMode="contain"
                        style={imageStyle} />
                </View>
                <View style={{ flex: 0.5 }}>
                    <Text
                        style={headerStyle}
                        {...testLabel('title_uploadSomething')}>
                        {tx('title_uploadSomething')}
                    </Text>
                </View>
            </ViewWithDrawer>
        );
    }
}
