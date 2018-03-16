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

const header2 = {
    justifyContent: 'center',
    marginBottom: vars.spacing.medium.midi
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

const headingStyle1 = {
    color: vars.textWhite100,
    textAlign: 'center',
    fontSize: vars.font.size.massive,
    fontWeight: vars.font.weight.semiBold,
    marginBottom: vars.spacing.small.maxi
};

const headingStyle2 = {
    color: vars.textWhite100,
    textAlign: 'center',
    fontSize: vars.font.size.bigger
};

const subHeadingStyle = {
    color: vars.textWhite70,
    textAlign: 'center',
    fontSize: vars.font.size.bigger
};

const scrollHeadingStyle = {
    color: vars.textDarkGrey,
    fontSize: vars.font.size.huge,
    textAlign: 'center',
    fontWeight: vars.font.weight.semiBold,
    marginBottom: vars.spacing.medium.midi2x
};

const scrollSubHeadingStyle = {
    color: vars.textDarkGrey,
    textAlign: 'center',
    fontSize: vars.font.size.bigger,
    marginHorizontal: vars.spacing.huge.midi2x,
    marginVertical: vars.spacing.small.midi
};

const footerText1 = {
    color: vars.textWhite50,
    textAlign: 'center'
};

const footerText2 = {
    color: vars.textWhite100,
    textAlign: 'center'
};

const buttonRowStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

export {
    headerWelcome, header2, inner, innerSmall, headingStyle1, headingStyle2, subHeadingStyle, scrollHeadingStyle,
    scrollSubHeadingStyle, footerText1, footerText2, row, circleTop, circleTopSmall,
    container, topCircleSizeSmall, embeddedImageCircleSize,
    padding, buttonRowStyle
};

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
            color: vars.textWhite100,
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
