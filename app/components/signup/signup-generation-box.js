import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { vars } from '../../styles/styles';
import SafeComponent from '../shared/safe-component';
import signupState from './signup-state';
import Text from '../controls/custom-text';

const accountKeyStyle = {
    fontSize: vars.font.size.xsmall,
    color: '#E90162',
    letterSpacing: 3
};

const dottedBoxStyle = {
    height: 44,
    borderColor: vars.mediumGrayBg,
    borderWidth: 0,
    borderStyle: 'dotted',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
};

@observer
export default class SignupGenerationBox extends SafeComponent {
    get animation() {
        return (
            <LottieView
                style={{}}
                resizeMode="cover"
                source={require('../../assets/loader-ak.json')}
                autoPlay
            />
        );
    }

    get text() {
        return (
            <Text monospace semibold style={accountKeyStyle}>
                {signupState.passphrase}
            </Text>
        );
    }

    renderThrow() {
        const { marginBottom, animated } = this.props;
        return (
            <View
                style={[
                    dottedBoxStyle,
                    {
                        marginBottom: marginBottom ? 24 : 0,
                        borderWidth: animated ? 0 : 2
                    }
                ]}
            >
                {animated ? this.animation : this.text}
            </View>
        );
    }
}
