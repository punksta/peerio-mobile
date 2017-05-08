import vars from './vars';
import common from './common';

const inputContainer = [common.fullAbsoluteContainer, {
    flexDirection: 'row'
}];

const alertInvisible = {
    borderBottomColor: 'transparent',
    borderBottomWidth: 2
};

const alertVisible = {
    borderBottomColor: vars.txtAlert,
    borderBottomWidth: 2
};

const radius = {
    height: vars.inputHeight,
    overflow: 'hidden',
    borderRadius: 2
};

const textbox = {
    flexGrow: 1,
    marginLeft: vars.inputPaddingLeft,
    height: 28,
    color: vars.inputBgInactiveText,
    fontSize: vars.font.size.normal
};

const shadowIOS = {
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {
        height: 1,
        width: 1
    }
};

const outerContainer = {
    marginBottom: 36,
    marginTop: 6
};

const hintContainer = [inputContainer, { paddingLeft: vars.inputPaddingLeft }];

export default {
    inputContainer,
    alertInvisible,
    alertVisible,
    focused: {
        outer: [outerContainer],
        radius: [radius, {
            // android shadow
            backgroundColor: vars.inputBg
            // elevation: 10
        }],
        textbox
    },
    blurred: {
        outer: [outerContainer],
        radius: [radius, {
            backgroundColor: vars.subtleBg
        }],
        textbox
    },
    hint: {
        normal: {
            container: hintContainer,
            text: {
                color: vars.txtMedium,
                alignSelf: 'center',
                fontSize: vars.font.size.normal
            }
        },
        small: {
            container: [hintContainer, { top: -vars.inputHeight / 2 }],
            text: {
                color: vars.txtMedium,
                alignSelf: 'center',
                fontSize: vars.font.size.small
            }
        }
    },
    iconContainer: {
        flexGrow: 0,
        flexShrink: 1,
        alignSelf: 'flex-end'
    }
};
