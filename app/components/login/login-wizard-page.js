import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tu } from '../utils/translator';
import Button from '../controls/button';
import { vars, wizard, helpers } from '../../styles/styles';

const container = {
    justifyContent: 'space-between',
    flex: 1,
    flexGrow: 1,
    padding: 20,
    paddingTop: 20 + vars.statusBarHeight
};
const header = {
    justifyContent: 'center',
    marginBottom: 12
};

const topCircleSize = 76;

const embeddedImageCircleSize = topCircleSize * 2 - 20;

const topCircleSizeSmall = 60;

const inner = {
    flex: 1,
    borderRadius: 4,
    marginTop: topCircleSize,
    paddingTop: topCircleSize + 12,
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
    justifyContent: 'space-between'
};

const title1 = {
    color: vars.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
};

const title1Black = [title1, { color: vars.txtDark, fontSize: 20, marginBottom: 20 }];

const title2 = {
    color: vars.white,
    textAlign: 'center',
    fontSize: 18
};

const title2Black = [title2, {
    marginHorizontal: 60,
    marginVertical: 6,
    color: vars.txtDark
}];

const title3 = {
    color: vars.white
};

export {
    header, inner, innerSmall, title1, title1Black, title2,
    title2Black, title3, row, circleTop, circleTopSmall,
    container, topCircleSizeSmall, embeddedImageCircleSize };

@observer
export default class LoginWizardPage extends SafeComponent {
    button(text, onPress, hidden, disabled) {
        const buttonContainer = {
            marginVertical: 20,
            alignItems: 'stretch',
            opacity: hidden ? 0 : 1
        };
        const button = {
            alignItems: 'center'
        };
        const buttonText = {
            fontWeight: 'bold',
            fontSize: 16
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
            testID={text}
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
