import {
    StyleSheet
} from 'react-native';

const vars = {
    circle: 8,
    bg: '#2C95CF',
    highlight: 'white',
    txtLight: '#bfdfef',
    txtDark: 'black',
    inputBg: 'white',
    inputBgInactive: '#c2e0ef',
    inputBgInactiveText: '#7c8e98',
    footerMarginX: 24
};

export const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 28,
        backgroundColor: vars.bg
    },
    container: {
        flex: 1,
        padding: 50,
        paddingTop: 0,
        borderColor: 'red',
        borderWidth: 0,
        backgroundColor: 'transparent'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    input: {
        height: 48,
        backgroundColor: vars.inputBg,
        color: vars.txtDark,
        padding: 10,
        borderRadius: 2
    },
    inputInactive: {
        height: 48,
        backgroundColor: vars.inputBgInactive,
        color: vars.inputBgInactiveText,
        fontSize: 14,
        padding: 10,
        borderRadius: 2
    },
    picker: {
        height: 300,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    pickerButton: {
        backgroundColor: '#1a6580',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
    },
    buttonSafe: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#95d583',
        height: 40
    },
    buttonPrimary: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2281c5',
        height: 40
    },
    buttonFooterLeft: {
        position: 'absolute',
        left: vars.footerMarginX,
        top: 0,
        height: 40
    },
    buttonFooterRight: {
        position: 'absolute',
        right: vars.footerMarginX,
        top: 0,
        height: 40
    },
    textTitle: {
        color: vars.txtLight,
        borderColor: 'yellow',
        borderWidth: 0
    },
    textSubTitle: {
        color: vars.txtLight,
        fontWeight: '400',
        fontSize: 22,
        marginTop: 12,
        marginBottom: 30
    },
    textInfo: {
        color: vars.txtLight,
        fontSize: 12
    },
    shadowBox: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 1,
            width: 1
        },
        margin: 2,
        marginBottom: 36,
        marginTop: 6
    },
    shadowBoxUnfocused: {
        margin: 2,
        marginBottom: 36,
        marginTop: 6
    },
    circle: {
        width: vars.circle,
        height: vars.circle,
        borderRadius: vars.circle/2,
        marginLeft: vars.circle,
        marginRight: vars.circle,
        backgroundColor: vars.txtLight
    },
    circleHighlight: {
        width: vars.circle,
        height: vars.circle,
        borderRadius: vars.circle/2,
        marginLeft: vars.circle,
        marginRight: vars.circle,
        backgroundColor: vars.highlight
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    }
});

