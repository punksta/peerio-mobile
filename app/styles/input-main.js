import vars from './vars';

const sendIconStyleNormal = {
    alignItems: 'center',
    backgroundColor: vars.checkboxIconInactive,
    borderRadius: 20,
    justifyContent: 'center',
    height: 40,
    marginRight: 8,
    width: 40
};

export default {
    tiStyle: {
        color: vars.txtDark,
        borderWidth: 0,
        borderColor: 'red',
        fontSize: 14
    },

    iconStyle: {
        width: 24,
        height: 24,
        margin: -12
    },

    outerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    autoExpandingInputContainerStyle: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'stretch'
    },

    sendIconStyleNormal,

    sendIconStyleActive: [sendIconStyleNormal, {
        backgroundColor: vars.checkboxActive
    }]
};
