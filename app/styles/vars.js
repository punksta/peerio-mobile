import { Platform, Dimensions } from 'react-native';
import branding from './branding';

const { bg, bgGradient, tabsBg, tabsFg } = branding;

const statusBarHeight = Platform.OS === 'android' ? 0 : 10;
const layoutPaddingTop = statusBarHeight * 2;

const r = 40;
const retentionOffset = { top: r, left: r, bottom: r, right: r };

const { height } = Dimensions.get('window');
// pixel ratio should be factored into scaleDim somehow: const pixRatio = PixelRatio.get();
const defaultHeight = 667;
// scaleDim takes a size value and returns one that is adjusted to the height of the device as it compares to an iPhone 6
const scaleDim = size => height / defaultHeight * size;

const vars = {
    circle: 10,
    circleSize: 4,
    bg,
    bgGradient,
    tabsBg,
    tabsFg,
    bgHighlight: 'rgba(50, 176, 227, 0.38)',
    yellowLine: '#f5e23e',
    disabled: '#00000020',
    highlight: '#FFFFFFCC',
    midlight: '#FFFFFF55',
    white: '#fff',
    whiteIcon: '#fff',
    notificationIcon: '#f00',
    usernameHighlight: '#32CEC3',
    darkIcon: '#00000070',
    txtLight: '#bfdfef',
    txtAlert: '#ff0000aa',
    txtDark: 'rgba(28, 28, 28, 1)',
    txtMedium: 'rgba(98, 98, 98, 1)',
    txtDate: 'rgba(0, 0, 0, .38)',
    inputBg: '#fff',
    lightGrayBg: '#f0f0f0',
    pickerBg: 'rgba(255, 255, 255, .12)',
    pickerText: '#fff',
    subtleBg: '#c3dfee',
    subtleText: 'rgba(0, 0, 0, .54)',
    subtleTextBold: 'rgba(0, 0, 0, .54',
    inputBgInactive: 'rgba(255, 255, 255, .5)',
    inputBgInactiveText: 'rgba(0,0,0, .54)',
    checkboxInactive: 'rgba(0,0,0,.06)',
    checkboxIconInactive: 'rgba(0, 0, 0, .54)',
    checkboxActive: 'rgba(35, 208, 137, 1)',
    snackbarBg: '#4a4a4a',
    snackbarBgGreen: '#38CE86',
    snackbarHeight: 48,
    settingsBg: 'rgba(0, 0, 0, 0.06)',
    gold: '#ffd700',
    fabEnabled: '#FF7D00',
    fabDisabled: '#CFCFCF',
    footerMarginX: 24,
    statusBarHeight,
    layoutPaddingTop,
    headerHeight: 80,
    headerSpacing: 56 + layoutPaddingTop,
    iconSize: 24,
    iconSizeSmall: 16,
    iconFileViewSize: 72,
    iconPadding: 12,
    menuWidthRatio: 0.8,
    animationDuration: 200,
    listItemHeight: 64,
    listViewPaddingVertical: 36,
    listViewPaddingHorizontal: 8,
    modalPaddingVertical: 40,
    modalPaddingHorizontal: 40,
    wizardPadding: 36,
    font: {
        size: {
            normal: scaleDim(14),
            smaller: scaleDim(12),
            small: 10,
            big: 18,
            bigger: scaleDim(16),
            huge: scaleDim(20),
            massive: scaleDim(24)
        },
        weight: {
            bold: '700',
            semiBold: '600',
            regular: '400'
        }
    },
    inputHeight: 48,
    inputPaddingLeft: 10,
    inputPaddedHeight: 56,
    fabSize: 60,
    fabRight: 16,
    fabBottom: 32,
    retentionOffset,
    channels: {
        rowCenterPadding: scaleDim(10),
        bottomRowText: {
            marginH: scaleDim(16)
        },
        textInput: {
            marginB: scaleDim(2)
        },
        label: {
            marginV: scaleDim(4),
            marginL: scaleDim(10)
        },
        exitRow: {
            padding: scaleDim(4)
        }
    },
    login: {
        spacing: {
            small: scaleDim(12),
            normal: scaleDim(20)
        },
        automatic: {
            buttonPadding: scaleDim(12),
            textMargin: scaleDim(22)
        },
        wizard: {
            title: {
                marginB: scaleDim(10),
                marginH: scaleDim(60),
                marginV: scaleDim(6)
            },
            input: {
                marginH: scaleDim(24),
                marginT: scaleDim(12)
            },
            debugMenu: {
                marginT: scaleDim(40),
                paddingH: scaleDim(24)
            },
            buttonPadding: scaleDim(4)
        }
    }
};

vars.iconLayoutSize = vars.iconSize + vars.iconPadding * 2;

export default vars;
