import React, { Component } from 'react';
import { Animated, View, Text, Image, Easing } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, computed } from 'mobx';
import { vars } from '../../styles/styles';
import loginState from '../login/login-state';
import routerApp from '../routes/router-app';
import { socket } from '../../lib/icebear';
import { promiseWhen } from '../helpers/sugar';
import routerMain from '../routes/router-main';
import { tx } from '../utils/translator';

@observer
export default class LoadingScreen extends Component {
    @observable loadingStep = 0;
    fadeValue;
    growValue;
    smallIcon;
    bigIcon;
    randomMessage;

    constructor(props) {
        super(props);
        this.fadeValue = new Animated.Value(0.70);
        this.growValue = new Animated.Value(1);
        this.smallIcon = {
            height: 24,
            width: 24,
            marginHorizontal: 6,
            transform: [{ scale: 1 }]
        };
        this.bigIcon = {
            height: 24,
            width: 24,
            marginHorizontal: 6,
            transform: [{ scale: this.growValue }],
            opacity: this.fadeValue
        };
        this.randomMessage = tx(this.randomMessages[Math.floor(Math.random() * this.randomMessages.length)]);
    }

    async componentDidMount() {
        try {
            await loginState.load();
            this.goToNextStep();
            await promiseWhen(() => socket.authenticated);
            this.goToNextStep();
            await promiseWhen(() => routerMain.chatStateLoaded);
            this.goToNextStep();
            await promiseWhen(() => routerMain.fileStateLoaded);
            this.goToNextStep();
            await promiseWhen(() => routerMain.contactStateLoaded);
            if (!loginState.loaded) routerApp.routes.loginStart.transition();
        } catch (e) {
            console.log('loading-screen.js: loading screen error');
            console.error(e);
        }
        this.fadeInOut();
        this.growIcon();
    }

    goToNextStep = () => {
        this.loadingStep++;
        this.growIcon();
    }

    fadeInOut() {
        Animated.sequence([
            Animated.timing(
                this.fadeValue,
                {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.linear,
                    useNativeDriver: true
                }),
            Animated.timing(
                this.fadeValue,
                {
                    toValue: 0.70,
                    duration: 400,
                    easing: Easing.linear,
                    useNativeDriver: true
                })
        ]).start(() => this.fadeInOut());
    }

    growIcon() {
        Animated.timing(
            this.growValue,
            {
                toValue: 1.5,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true
            }).start();
    }

    getSource(imageName) {
        return this.images[this.loadingStep][imageName];
    }

    @computed get connectingIconStyle() {
        if (this.loadingStep === 0) return this.bigIcon;
        return this.smallIcon;
    }

    @computed get authenticatingIconStyle() {
        if (this.loadingStep === 1) return this.bigIcon;
        return this.smallIcon;
    }

    @computed get decryptingIconStyle() {
        if (this.loadingStep === 2) return this.bigIcon;
        return this.smallIcon;
    }

    @computed get confirmingIconStyle() {
        if (this.loadingStep === 3) return this.bigIcon;
        return this.smallIcon;
    }

    @computed get doneIconStyle() {
        if (this.loadingStep === 4) return this.bigIcon;
        return this.smallIcon;
    }

    getStatusText() {
        switch (this.loadingStep) {
            case (0):
                return tx(this.imageDescriptions.connecting.copy);
            case (1):
                return tx(this.imageDescriptions.authenticating.copy);
            case (2):
                return tx(this.imageDescriptions.decrypting.copy);
            case (3):
                return tx(this.imageDescriptions.confirming.copy);
            case (4):
                return tx(this.imageDescriptions.done.copy);
            default:
                return tx(this.imageDescriptions.connecting.copy);
        }
    }

    renderImages = (name) => {
        const lineStyle = {
            height: 3,
            width: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 5
        };
        return (
            <View style={{ flexDirection: 'row', height: 48, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image
                    key={`${name}Icon`}
                    source={this.getSource(`${name}Icon`)}
                    style={this[`${name}IconStyle`]}
                    resizeMode="contain"
                />
                <Image
                    key={`${name}Line`}
                    source={this.getSource(`${name}Line`)}
                    style={lineStyle}
                    resizeMode="contain"
                />
            </View>
        );
    }

    render() {
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
        return (
            <View style={container}>
                <Text style={flavorTextStyle}>
                    {this.randomMessage}
                </Text>
                <View style={loadingProgressContainer}>
                    <View style={iconContainer}>
                        {this.states.map(this.renderImages)}
                    </View>
                    <Text style={statusTextStyle}>
                        {this.getStatusText()}
                    </Text>
                </View>
            </View>
        );
    }

    randomMessages = [
        'title_randomMessage1',
        'title_randomMessage2',
        'title_randomMessage3',
        'title_randomMessage4'
    ];

    states = [
        'connecting',
        'authenticating',
        'decrypting',
        'confirming',
        'done'
    ];

    imageDescriptions = {
        connecting: {
            copy: 'title_connecting',
            source: {
                inProgress: require('../../assets/loading_screens/connecting-inProgress.png'),
                Done: require('../../assets/loading_screens/connecting-done.png')
            }
        },
        authenticating: {
            copy: 'title_authenticating',
            source: {
                dormant: require('../../assets/loading_screens/authenticating-dormant.png'),
                inProgress: require('../../assets/loading_screens/authenticating-inProgress.png'),
                done: require('../../assets/loading_screens/authenticating-done.png')
            }
        },
        decrypting: {
            copy: 'title_decrypting',
            source: {
                dormant: require('../../assets/loading_screens/decrypting-dormant.png'),
                inProgress: require('../../assets/loading_screens/decrypting-inProgress.png'),
                done: require('../../assets/loading_screens/decrypting-done.png')
            }
        },
        confirming: {
            copy: 'title_confirming',
            source: {
                dormant: require('../../assets/loading_screens/confirming-dormant.png'),
                inProgress: require('../../assets/loading_screens/confirming-inProgress.png'),
                done: require('../../assets/loading_screens/confirming-done.png')
            }
        },
        done: {
            copy: 'title_done',
            source: {
                dormant: require('../../assets/loading_screens/done-dormant.png'),
                inProgress: require('../../assets/loading_screens/done-inProgress.png')
            }
        },
        line: {
            source: {
                dormant: require('../../assets/loading_screens/line-dormant.png'),
                inProgress: require('../../assets/loading_screens/line-inProgress.png'),
                done: require('../../assets/loading_screens/line-done.png')
            }
        }
    };

    // Maps each Loading Step to the assets that each image should use
    images = {
        // Loading Step
        0: {
            // Icons
            connectingIcon: this.imageDescriptions.connecting.source.inProgress,
            connectingLine: this.imageDescriptions.line.source.InProgress,
            authenticatingIcon: this.imageDescriptions.authenticating.source.dormant,
            authenticatingLine: this.imageDescriptions.line.source.dormant,
            decryptingIcon: this.imageDescriptions.decrypting.source.dormant,
            decryptingLine: this.imageDescriptions.line.source.dormant,
            confirmingIcon: this.imageDescriptions.confirming.source.dormant,
            confirmingLine: this.imageDescriptions.line.source.dormant,
            doneIcon: this.imageDescriptions.done.source.dormant,
            doneLine: this.imageDescriptions.line.source.dormant
        },
        1: {
            connectingIcon: this.imageDescriptions.connecting.source.done,
            connectingLine: this.imageDescriptions.line.source.done,
            authenticatingIcon: this.imageDescriptions.authenticating.source.inProgress,
            authenticatingLine: this.imageDescriptions.line.source.inProgress,
            decryptingIcon: this.imageDescriptions.decrypting.source.dormant,
            decryptingLine: this.imageDescriptions.line.source.dormant,
            confirmingIcon: this.imageDescriptions.confirming.source.dormant,
            confirmingLine: this.imageDescriptions.line.source.dormant,
            doneIcon: this.imageDescriptions.done.source.dormant,
            doneLine: this.imageDescriptions.line.source.dormant
        },
        2: {
            connectingIcon: this.imageDescriptions.connecting.source.done,
            connectingLine: this.imageDescriptions.line.source.done,
            authenticatingIcon: this.imageDescriptions.authenticating.source.done,
            authenticatingLine: this.imageDescriptions.line.source.done,
            decryptingIcon: this.imageDescriptions.decrypting.source.inProgress,
            decryptingLine: this.imageDescriptions.line.source.inProgress,
            confirmingIcon: this.imageDescriptions.confirming.source.dormant,
            confirmingLine: this.imageDescriptions.line.source.dormant,
            doneIcon: this.imageDescriptions.done.source.dormant,
            doneLine: this.imageDescriptions.line.source.dormant
        },
        3: {
            connectingIcon: this.imageDescriptions.connecting.source.done,
            connectingLine: this.imageDescriptions.line.source.done,
            authenticatingIcon: this.imageDescriptions.authenticating.source.done,
            authenticatingLine: this.imageDescriptions.line.source.done,
            decryptingIcon: this.imageDescriptions.decrypting.source.done,
            decryptingLine: this.imageDescriptions.line.source.done,
            confirmingIcon: this.imageDescriptions.decrypting.source.inProgress,
            confirmingLine: this.imageDescriptions.line.source.inProgress,
            doneIcon: this.imageDescriptions.done.source.dormant,
            doneLine: this.imageDescriptions.line.source.dormant
        },
        4: {
            connectingIcon: this.imageDescriptions.connecting.source.done,
            connectingLine: this.imageDescriptions.line.source.done,
            authenticatingIcon: this.imageDescriptions.authenticating.source.done,
            authenticatingLine: this.imageDescriptions.line.source.done,
            decryptingIcon: this.imageDescriptions.decrypting.source.done,
            decryptingLine: this.imageDescriptions.line.source.done,
            confirmingIcon: this.imageDescriptions.confirming.source.done,
            confirmingLine: this.imageDescriptions.line.source.done,
            doneIcon: this.imageDescriptions.done.source.inProgress,
            doneLine: this.imageDescriptions.line.source.inProgress
        }
    };
}
