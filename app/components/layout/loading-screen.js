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
const lineDormant = require('../../assets/loading_screens/line-dormant.png');
const lineInProgress = require('../../assets/loading_screens/line-inProgress.png');
const lineDone = require('../../assets/loading_screens/line-done.png');

@observer
export default class LoadingScreen extends Component {
    // Maps each state to which asset the image should use
    images = {
        // Loading Step
        0: {
            // Icons
            connectingIcon: connectingInProgress,
            connectingLine: lineInProgress,
            authenticatingIcon: authenticatingDormant,
            authenticatingLine: lineDormant,
            decryptingIcon: decryptingDormant,
            decryptingLine: lineDormant,
            confirmingIcon: confirmingDormant,
            confirmingLine: lineDormant,
            doneIcon: doneDormant,
            doneLine: lineDormant
        },
        1: {
            connectingIcon: connectingDone,
            connectingLine: lineDone,
            authenticatingIcon: authenticatingInProgress,
            authenticatingLine: lineInProgress,
            decryptingIcon: decryptingDormant,
            decryptingLine: lineDormant,
            confirmingIcon: confirmingDormant,
            confirmingLine: lineDormant,
            doneIcon: doneDormant,
            doneLine: lineDormant
        },
        2: {
            connectingIcon: connectingDone,
            connectingLine: lineDone,
            authenticatingIcon: authenticatingDone,
            authenticatingLine: lineDone,
            decryptingIcon: decryptingInProgress,
            decryptingLine: lineInProgress,
            confirmingIcon: confirmingDormant,
            confirmingLine: lineDormant,
            doneIcon: doneDormant,
            doneLine: lineDormant
        },
        3: {
            connectingIcon: connectingDone,
            connectingLine: lineDone,
            authenticatingIcon: authenticatingDone,
            authenticatingLine: lineDone,
            decryptingIcon: decryptingDone,
            decryptingLine: lineDone,
            confirmingIcon: confirmingInProgress,
            confirmingLine: lineInProgress,
            doneIcon: doneDormant,
            doneLine: lineDormant
        },
        4: {
            connectingIcon: connectingDone,
            connectingLine: lineDone,
            authenticatingIcon: authenticatingDone,
            authenticatingLine: lineDone,
            decryptingIcon: decryptingDone,
            decryptingLine: lineDone,
            confirmingIcon: confirmingDone,
            confirmingLine: lineDone,
            doneIcon: doneInProgress,
            doneLine: lineInProgress
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingStep: 3
        };
        this.fadeValue = new Animated.Value(0.80);
        this.growValue = new Animated.Value(24);
        // TODO Delete setInterval(.....)
        setInterval(this.changeState, 2000);
    }

    componentDidMount() {
        this.fadeInOut();
        this.growIcon();
    }

    // Delete this function
    changeState = () => {
        console.log('State changed');
        const nextStep = (this.state.loadingStep === 4) ? 0 : this.state.loadingStep + 1;
        this.setState({
            loadingStep: nextStep
        });
    }

    fadeInOut() {
        console.log('Fading');
        Animated.sequence([
            Animated.timing(
                this.fadeValue,
                {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear
                }),
            Animated.timing(
                this.fadeValue,
                {
                    toValue: 0.80,
                    duration: 500,
                    easing: Easing.linear
                })
        ]).start(() => this.fadeInOut());
    }

    growIcon() {
        console.log('Growing');
        Animated.timing(
            this.growValue,
            {
                toValue: 36,
                duration: 300,
                easing: Easing.linear
            }).start();
    }

    getSource(imageName) {
        return this.images[this.state.loadingStep][imageName];
    }

    getIconStyle(imageName) {
        const smallIcon = { height: 24, width: 24, marginHorizontal: 6 };
        const bigIcon = { height: this.growValue, width: this.growValue, opacity: this.fadeValue };
        if (this.state.loadingStep === 0 && imageName === 'connectingIcon') return bigIcon;
        else if (this.state.loadingStep === 1 && imageName === 'authenticatingIcon') return bigIcon;
        else if (this.state.loadingStep === 2 && imageName === 'decryptingIcon') return bigIcon;
        else if (this.state.loadingStep === 3 && imageName === 'confirmingIcon') return bigIcon;
        else if (this.state.loadingStep === 4 && imageName === 'doneIcon') return bigIcon;
        return smallIcon;
    }

    getStatusText() {
        switch (this.state.loadingStep) {
            case (0):
                return 'Connecting...';
            case (1):
                return 'Authenticating...';
            case (2):
                return 'Decrypting...';
            case (3):
                return 'Confirming data...';
            case (4):
                return 'Done!';
            default:
                return 'Connecting...';
        }
    }

    render() {
        this.step = this.state.step;
        const container = {
            backgroundColor: 'white',
            flex: 1,
            flexGrow: 1,
            alignItems: 'center'
        };
        const flavorTextStyle = {
            fontSize: vars.font.size.big,
            color: vars.subtleText,
            paddingHorizontal: 24,
            textAlign: 'center',
            marginTop: vars.spacing.huge.maxi2x * 2.75
        };
        const loadingProgressContainer = {
            flex: 1,
            flexGrow: 1,
            justifyContent: 'flex-end',
            marginBottom: vars.spacing.huge.maxi2x * 2.25
        };
        const iconContainer = {
            flexDirection: 'row',
            paddingHorizontal: 40,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center'
        };
        const statusTextStyle = {
            marginTop: 20,
            fontSize: vars.font.size.big,
            color: vars.subtleText,
            textAlign: 'center'
        };
        const lineStyle = {
            height: 3,
            width: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 5
        };
        return (
            <View style={container}>
                <Text style={flavorTextStyle}>
                    Lorem Ipsum dolores sit resgtihm. orleoro colares ip
                </Text>
                <View style={loadingProgressContainer}>
                    <View style={iconContainer}>
                        <Animated.Image
                            source={this.getSource('connectingIcon')}
                            style={this.getIconStyle('connectingIcon')}
                            resizeMode="contain"
                        />
                        <Image
                            source={this.getSource('connectingLine')}
                            style={lineStyle}
                            resizeMode="contain"
                        />
                        <Animated.Image
                            source={this.getSource('authenticatingIcon')}
                            style={this.getIconStyle('authenticatingIcon')}
                            resizeMode="contain"
                        />
                        <Image
                            source={this.getSource('authenticatingLine')}
                            style={lineStyle}
                            resizeMode="contain"
                        />
                        <Animated.Image
                            source={this.getSource('decryptingIcon')}
                            style={this.getIconStyle('decryptingIcon')}
                            resizeMode="contain"
                        />
                        <Image
                            source={this.getSource('decryptingLine')}
                            style={lineStyle}
                            resizeMode="contain"
                        />
                        <Animated.Image
                            source={this.getSource('confirmingIcon')}
                            style={this.getIconStyle('confirmingIcon')}
                            resizeMode="contain"
                        />
                        <Image
                            source={this.getSource('confirmingLine')}
                            style={lineStyle}
                            resizeMode="contain"
                        />
                        <Animated.Image
                            source={this.getSource('doneIcon')}
                            style={this.getIconStyle('doneIcon')}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={statusTextStyle}>
                        {this.getStatusText()}
                    </Text>
                </View>
            </View>
        );
    }
}
