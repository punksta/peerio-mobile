import React from 'react';
import { observable, action, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, LayoutAnimation } from 'react-native';
import randomWords from 'random-words';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import SignupButtonBack from './signup-button-back';

const { validators } = validation;
const { username } = validators;

@observer
export default class SignupStep2 extends SafeComponent {
    usernameState = observable({ value: '' });

    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }

    componentDidMount() {
        // QUICK SIGNUP DEV FLAG
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            this.usernameInput.onChangeText(randomWords({ min: 2, max: 2, join: 'o' }).substring(0, 16));
        }
        // fill fields when returning from another step
        if (signupState.username) {
            this.usernameState.value = signupState.username;
            this.usernameInput.onChangeText(this.usernameState.value);
        }

        this.suggestionAnimationReaction = reaction(
            () => signupState.usernameSuggestions,
            () => LayoutAnimation.easeInEaseOut()
        );

        signupState.suggestUsernames();
    }

    componentWillUnmount() {
        this.suggestionAnimationReaction();
    }

    @action.bound handleNextButton() {
        signupState.username = this.usernameState.value;
        signupState.next();
    }

    get isNextDisabled() { return !socket.connected || !this.usernameState.value || !this.usernameInput.isValid; }

    @action.bound fillField(suggestion) {
        this.usernameState.value = suggestion;
        this.usernameInput.onChangeText(this.usernameState.value);
    }

    suggestionPill = (suggestion) => {
        if (!suggestion) return null;
        const style = {
            height: 21,
            borderColor: vars.peerioPurple,
            borderWidth: 1,
            borderRadius: 16,
            marginRight: vars.spacing.small.midi2x,
            marginBottom: vars.spacing.small.midi,
            paddingHorizontal: vars.spacing.small.midi
        };
        const textStyle = {
            color: vars.peerioPurple,
            backgroundColor: 'transparent'
        };

        return (
            <TouchableOpacity
                key={suggestion}
                pressRetentionOffset={vars.retentionOffset}
                onPress={() => this.fillField(suggestion)}>
                <View style={style}>
                    <Text style={textStyle}>{suggestion}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    get suggestionBlock() {
        if (!signupState.usernameSuggestions.length) return null;
        return (
            <View>
                <View style={signupStyles.separator} />
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Text style={signupStyles.suggestionTitle}>{tx('title_available')}</Text>
                    </View>
                    <View style={signupStyles.suggestionContainer}>
                        {signupState.usernameSuggestions.map(this.suggestionPill)}
                    </View>
                </View>
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.progressBarContainer}>
                    <View style={signupStyles.filledProgressBar} />
                    <View style={[signupStyles.filledProgressBar, { marginHorizontal: 1 }]} />
                    <View style={signupStyles.emptyProgressBar} />
                </View>
                <View style={signupStyles.container}>
                    <SignupButtonBack />
                    <View style={signupStyles.headerContainer}>
                        <Text semibold serif style={signupStyles.headerStyle}>{tx('title_createYourAccount')}</Text>
                        <Text style={signupStyles.headerDescription}>{tx('title_usernameHeading')}</Text>
                    </View>
                    <StyledTextInput
                        state={this.usernameState}
                        validations={username}
                        hint={tx('title_username')}
                        lowerCase
                        required
                        keyboardType="email-address"
                        returnKeyType="next"
                        ref={this.usernameInputRef}
                        testID="username" />
                    {this.suggestionBlock}
                    <View style={{ alignItems: 'flex-end', marginVertical: 30 }}>
                        {buttons.roundBlueBgButton(
                            tx('button_next'),
                            this.handleNextButton,
                            this.isNextDisabled,
                            'button_next',
                            { width: vars.signupButtonWidth })}
                    </View>
                </View>
            </View>
        );
    }
}
