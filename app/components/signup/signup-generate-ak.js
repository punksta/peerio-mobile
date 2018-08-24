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
                    <Text semibold serif style={signupStyles.headerStyle2}>
                        {tx('title_generatingAk')}
                    </Text>
                    <Text style={signupStyles.headerDescription2}>
                        {tx('title_generatingAkDescription')}
                    </Text>
                    <SignupGenerationBox marginBottom />
                    <Text style={signupStyles.description}>
                        {tx('title_generatingAkExplanation')}
                    </Text>
                </View>
            </View>
        );
    }
}
