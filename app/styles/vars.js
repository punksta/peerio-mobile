import { Platform } from 'react-native';
import branding from './branding';

const { bg, bgGradient, tabsBg, tabsFg } = branding;

const statusBarHeight = Platform.OS === 'android' ? 0 : 10;
const layoutPaddingTop = statusBarHeight * 2;

const r = 40;
const retentionOffset = { top: r, left: r, bottom: r, right: r };

const vars = {
    circle: 10,
    bg,
    bgGradient,
    tabsBg,
    tabsFg,
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
    txtDark: 'rgba(0, 0, 0, .87)',
    txtMedium: 'rgba(0, 0, 0, .54)',
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
            normal: 14,
            smaller: 12,
            small: 10,
            big: 18,
            bigger: 16
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
    retentionOffset
};

vars.iconLayoutSize = vars.iconSize + vars.iconPadding * 2;

export default vars;
