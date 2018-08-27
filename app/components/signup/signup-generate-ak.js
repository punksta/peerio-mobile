import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import { signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import SignupGenerationBox from './signup-generation-box';
import SignupHeading from './signup-heading';

@observer
export default class SignupGenerateAk extends SafeComponent {
    @action.bound componentDidMount() {
        // TODO replace timeout with wait for animation to finish
        setTimeout(() => { signupState.next(); }, 2000);
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <SignupHeading title="title_generatingAk" subTitle="title_generatingAkDescription" />
                    <SignupGenerationBox marginBottom />
                    <Text style={signupStyles.description}>
                        {tx('title_generatingAkExplanation')}
                    </Text>
                </View>
            </View>
        );
    }
}
