import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tu } from '../utils/translator';
import Button from '../controls/button';
import { vars, wizard, helpers } from '../../styles/styles';
import testLabel from '../helpers/test-label';

const padding = vars.spacing.medium.midi2x;

const container = {
    flex: 1,
    flexGrow: 1,
    padding,
    paddingTop: vars.spacing.huge.minixx + vars.statusBarHeight
};

const headerWelcome = {
    justifyContent: 'center',
    marginBottom: vars.spacing.large.maxi
};

const headerSignup = {
    justifyContent: 'center',
    marginBottom: vars.spacing.small.midi2x
};

const topCircleSize = 68;

const embeddedImageCircleSize = topCircleSize * 2;

const topCircleSizeSmall = 52;

const inner = {
    flex: 1,
    borderRadius: 4,
    marginTop: topCircleSize,
    paddingTop: topCircleSize + vars.spacing.small.maxi2x,
    backgroundColor: vars.lightGrayBg
};

const innerSmall = [inner, {
    flex: 1,
    marginTop: topCircleSizeSmall,
    paddingTop: topCircleSizeSmall
}];

const circleTop = [helpers.circle(topCircleSize * 2), {
    top: 0,
    backgroundColor: vars.lightGrayBg,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
}];

const circleTopSmall = [circleTop, helpers.circle(topCircleSizeSmall * 2), {
    borderWidth: 1,
    borderColor: vars.bg
}];

const row = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 90
};

const title1 = {
    color: vars.white,
    textAlign: 'center',
    fontSize: vars.font.size.massive,
    fontWeight: '500',
    marginBottom: vars.spacing.small.maxi
};

const title1Black = [title1, {
    color: vars.txtDark,
    fontSize: vars.font.size.huge,
    marginBottom: vars.spacing.medium.midi2x
}];

const title2 = {
    color: vars.white,
    textAlign: 'center',
    fontSize: vars.font.size.bigger
};

const title2Black = [title2, {
    marginHorizontal: vars.spacing.huge.midi2x,
    marginVertical: vars.spacing.small.midi,
    color: vars.txtDark
}];

const title3 = {
    color: vars.white,
    textAlign: 'center'
};

const buttonRowStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

export {
    headerWelcome, headerSignup, inner, innerSmall, title1, title1Black, title2,
    title2Black, title3, row, circleTop, circleTopSmall,
    container, topCircleSizeSmall, embeddedImageCircleSize,
    padding, buttonRowStyle };

@observer
export default class LoginWizardPage extends SafeComponent {
    button(text, onPress, hidden, disabled) {
        const buttonContainer = {
            marginVertical: vars.spacing.medium.midi2x,
            alignItems: 'stretch',
            opacity: hidden ? 0 : 1
        };
        const button = {
            alignItems: 'center'
        };
        const buttonText = {
            fontWeight: 'bold',
            fontSize: vars.font.size.bigger
        };
        return (
            <View style={buttonContainer} key={text}>
                {this._button(text, onPress, button, buttonText, disabled)}
            </View>
        );
    }

    _button(text, onPress, style, textStyle, disabled) {
        return (
            <Button style={[style, disabled && { opacity: 0.5 }]}
            {...testLabel(text)}
            textStyle={textStyle}
            text={tu(text)}
            onPress={disabled ? null : onPress} />
        );
    }

    _footerButton(text, onPress, style, disabled) {
        const s = wizard.footer.button.base;
        return this._button(text, onPress, [s, style], { fontWeight: 'bold' }, disabled);
    }

    buttons() {
        return null;
    }

    items() {
        return null;
    }


}
