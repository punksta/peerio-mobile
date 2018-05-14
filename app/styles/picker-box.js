import vars from './vars';

const iconContainer = {
    position: 'absolute',
    right: 0,
    top: 0
};

const icon = {
    backgroundColor: 'transparent'
};

const shadowNormal = {
    height: vars.inputHeight,
    margin: vars.spacing.medium.mini2x,
    marginTop: vars.spacing.small.midi,
    // backgroundColor: vars.inputBg,
    paddingHorizontal: vars.inputPaddingHorizontal,
    borderColor: vars.inputBorderColor,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden'
};

const shadowActive = {
    // shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {
        height: 1,
        width: 1
    },
    paddingHorizontal: vars.inputPaddingHorizontal
};

const inputActive = {
    flexGrow: 1,
    height: vars.inputHeight,
    fontSize: vars.font.size.normal,
    color: vars.textBlack38
};

const inputContainer = {
    height: vars.inputHeight,
    opacity: 1,
    marginTop: -2
};

export default {
    normal: {
        textview: [inputActive, {
            color: vars.textBlack38,
            top: 16
        }],
        shadow: [shadowNormal, {
            backgroundColor: 'transparent'
        }],
        background: {
            backgroundColor: 'transparent'
        },
        container: [inputContainer
        //     {
        //     backgroundColor: vars.pickerBg,
        //     borderRadius: 2,
        //     overflow: 'hidden'
        // }
        ],
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
            backgroundColor: 'transparent'
            // backgroundColor: vars.inputBg,
            // borderRadius: 2,
            // overflow: 'hidden'
        },
        container: [inputContainer, {
            backgroundColor: 'transparent'
        }],
        iconContainer,
        icon
    }
};
