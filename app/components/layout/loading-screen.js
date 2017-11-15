import React, { Component } from 'react';
import { Animated, View, Text, Image, Easing } from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';

const connectingInProgress = require('../../assets/loading_screens/connecting-inProgress.png');
const connectingDone = require('../../assets/loading_screens/connecting-done.png');
const authenticatingDormant = require('../../assets/loading_screens/authenticating-dormant.png');
const authenticatingInProgress = require('../../assets/loading_screens/authenticating-inProgress.png');
const authenticatingDone = require('../../assets/loading_screens/authenticating-done.png');
const decryptingDormant = require('../../assets/loading_screens/decrypting-dormant.png');
const decryptingInProgress = require('../../assets/loading_screens/decrypting-inProgress.png');
const decryptingDone = require('../../assets/loading_screens/decrypting-done.png');
const confirmingDormant = require('../../assets/loading_screens/confirming-dormant.png');
const confirmingInProgress = require('../../assets/loading_screens/confirming-inProgress.png');
const confirmingDone = require('../../assets/loading_screens/confirming-done.png');
const doneDormant = require('../../assets/loading_screens/done-dormant.png');
const doneInProgress = require('../../assets/loading_screens/done-inProgress.png');

@observer
export default class LoadingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingStep: 'decrypting_loading'
        };
        this.fadeValue = new Animated.Value(0.38);
    }

    componentDidMount () {
        this.fadeInOut();
    }

    fadeInOut () {
        Animated.sequence([
            Animated.timing(
                this.fadeValue,
                {
                    toValue: 0.58,
                    duration: 500,
                    easing: Easing.linear
                }),
            Animated.timing(
                this.fadeValue,
                {
                    toValue: 0.34,
                    duration: 500,
                    easing: Easing.linear
                })
        ]).start(() => this.fadeInOut());
    }

    icons = {
        // Loading Step
        connecting_loading: {
            // Icons
            connecting: connectingInProgress,
            authenticating: authenticatingDormant,
            decrypting: decryptingDormant,
            confirming: confirmingDormant,
            done: doneDormant
        },
        authenticating_loading: {
            connecting: connectingDone,
            authenticating: authenticatingInProgress,
            decrypting: decryptingDormant,
            confirming: confirmingDormant,
            done: doneDormant
        },
        decrypting_loading: {
            connecting: connectingDone,
            authenticating: authenticatingDone,
            decrypting: decryptingInProgress,
            confirming: confirmingDormant,
            done: doneDormant
        },
        confirming_loading: {
            connecting: connectingDone,
            authenticating: authenticatingDone,
            decrypting: decryptingDone,
            confirming: confirmingInProgress,
            done: doneDormant
        },
        done_loading: {
            connecting: connectingDone,
            authenticating: authenticatingDone,
            decrypting: decryptingDone,
            confirming: confirmingDone,
            done: doneInProgress
        }
    };

    getSource(iconName) {
        return this.icons[this.state.loadingStep][iconName];
    }

    render() {
        this.step = this.state.step;
        const statusTextAnimation = { opacity: this.fadeValue };
        const container = {
            backgroundColor: 'white',
            flex: 1,
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center'
        };
        const flavorTextStyle = {
            fontSize: vars.font.size.big,
            color: vars.subtleText,
            paddingHorizontal: 24,
            textAlign: 'center'
        };
        const loadingProgressContainer = {
            flexDirection: 'row',
            paddingHorizontal: 40
        };
        const statusTextStyle = {
            fontSize: vars.font.size.big,
            textAlign: 'center'
        };
        return (
            <View style={container}>
                <Text style={flavorTextStyle}>
                    Lorem Ipsum dolores sit resgtihm. orleoro colares ip
                </Text>
                <View>
                    <View style={loadingProgressContainer}>
                        <Image
                            source={this.getSource('connecting')}
                        />
                        <Image
                            source={this.getSource('authenticating')}
                        />
                        <Image
                            source={this.getSource('decrypting')}
                        />
                        <Image
                            source={this.getSource('confirming')}
                        />
                        <Image
                            source={this.getSource('done')}
                        />
                    </View>
                    <Animated.Text style={[statusTextStyle, statusTextAnimation]}>
                        Authenticating...
                    </Animated.Text>
                </View>
            </View>
        );
    }
}
