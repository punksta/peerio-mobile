import vars from './vars';

const iconContainer = {
    position: 'absolute',
    right: 2,
    top: 2
};

const icon = {
    backgroundColor: 'transparent'
};

const shadowNormal = {
    height: vars.inputHeight,
    margin: 2,
    marginBottom: 36,
    marginTop: 6,
    backgroundColor: vars.inputBg
};

const shadowActive = {
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {
        height: 1,
        width: 1
    }
};

const inputActive = {
    flexGrow: 1,
    marginLeft: 10,
    height: 28,
    backgroundColor: 'transparent',
    borderColor: 'yellow',
    borderWidth: 0,
    fontSize: 14,
    color: vars.txtDark
};

const inputContainer = {
    height: vars.inputHeight,
    opacity: 1
};

export default {
    normal: {
        textview: [inputActive, {
            color: vars.pickerText,
            top: 16
        }],
        shadow: [shadowNormal, {
            backgroundColor: 'transparent'
        }],
        background: {
            backgroundColor: 'transparent'
        },
        container: [inputContainer, {
            backgroundColor: vars.pickerBg,
            borderRadius: 2,
            overflow: 'hidden'
        }],
        iconContainer,
        icon
    },
    active: {
        textview: [inputActive, {
            top: 16
        }],
        shadow: [shadowActive, {
            backgroundColor: 'transparent'
        }],
        background: {
            backgroundColor: vars.inputBg,
            borderRadius: 2,
            overflow: 'hidden'
        },
        container: [inputContainer, {
            backgroundColor: 'transparent'
        }],
        iconContainer,
        icon
    }
};
