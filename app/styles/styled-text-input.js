import vars from './vars';
import common from './common';

const textinputStyle = {
    color: vars.black87,
    // without input height text input is rendered zero-height on iOS
    height: vars.inputHeight,
    fontSize: vars.font.size.normal,
    paddingHorizontal: vars.inputPaddingHorizontal
};

const errorContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi,
    height: vars.spacing.medium.midi2x
};

const errorStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.red
};

const inputContainer = [
    common.fullAbsoluteContainer,
    { flexDirection: 'row' }
];

const iconContainer = {
    flexGrow: 0,
    flexShrink: 1,
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 15
};

export default {
    textinputStyle,
    errorContainer,
    errorStyle,
    inputContainer,
    iconContainer
};
