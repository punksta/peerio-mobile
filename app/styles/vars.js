import { Platform, Dimensions } from 'react-native';
import branding from './branding';

const { width, height } = Dimensions.get('window');

function isIphoneX() {
    const { OS, isPad, isTVOS } = Platform;
    const dim = 812;
    return (
        OS === 'ios' && !isPad && !isTVOS && (width === dim || height === dim)
    );
}

const iPhoneXTop = isIphoneX() ? 16 : 0;
const iPhoneXBottom = iPhoneXTop;

const { bg, bgGradient, tabsBg, tabsFg } = branding;

const statusBarHeight = (Platform.OS === 'android' ? 0 : 10) + iPhoneXTop;
const layoutPaddingTop = statusBarHeight * 2;

const r = 40;
const retentionOffset = { top: r, left: r, bottom: r, right: r };

const tabCellHeight = 56;

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
    black: '#000',
    white: '#fff',
    whiteIcon: '#fff',
    notificationIcon: '#f00',
    usernameHighlight: '#32CEC3',
    darkIcon: '#00000070',
    txtLight: '#bfdfef',
    txtAlert: '#ff0000aa',
    txtLightGrey: '#7B7B7B',
    txtDark: 'rgba(28, 28, 28, 1)',
    txtMedium: 'rgba(98, 98, 98, 1)',
    txtDate: 'rgba(0, 0, 0, .38)',
    inputBg: '#fff',
    lightGrayBg: '#f0f0f0',
    pickerBg: 'rgba(255, 255, 255, .12)',
    pickerText: '#fff',
    subtleBg: '#c3dfee',
    subtleText: 'rgba(0, 0, 0, .54)',
    extraSubtleText: 'rgba(0, 0, 0, .38)',
    subtleTextBold: 'rgba(0, 0, 0, .54',
    verySubtleGrey: 'rgba(0, 0, 0, .12)',
    inputBgInactive: 'rgba(255, 255, 255, .5)',
    inputBgInactiveText: 'rgba(0,0,0, .54)',
    checkboxInactive: 'rgba(0,0,0,.06)',
    checkboxIconInactive: 'rgba(0, 0, 0, .54)',
    checkboxActive: 'rgba(35, 208, 137, 1)',
    snackbarBg: '#4a4a4a',
    snackbarBgGreen: '#38CE86',
    snackbarHeight: 48,
    popupMinHeight: scaleDim(110),
    settingsBg: 'rgba(0, 0, 0, 0.06)',
    gold: '#ffd700',
    fabEnabled: '#FF7D00',
    fabDisabled: '#CFCFCF',
    footerMarginX: 24,
    statusBarHeight,
    layoutPaddingTop,
    headerHeight: 80 + iPhoneXTop,
    headerSpacing: 56 + layoutPaddingTop,
    iconSize: 24,
    iconSizeSmall: 16,
    iconSizeLarge: 48,
    iconFileViewSize: 72,
    iconPadding: 12,
    iconSizeBigger: 25,
    iconMargin: 30,
    menuWidthRatio: 0.8,
    animationDuration: 200,
    listItemHeight: 64,
    listViewPaddingVertical: 36,
    listViewPaddingHorizontal: 8,
    loadingScreenMarginBottom: scaleDim(170),
    loadingScreenMarginTop: scaleDim(206),
    modalPaddingVertical: 40,
    modalPaddingHorizontal: 40,
    wizardPadding: 36,
    height80: height * 0.8,

    font: {
        size: {
            xsmall: scaleDim(8),
            normal: scaleDim(14),
            smaller: scaleDim(12),
            small: scaleDim(10),
            big: scaleDim(18),
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
    accountTitleFontSize: scaleDim(37),
    accountListFontSize: scaleDim(21),
    signupFontSize: scaleDim(36),
    profileEditFontSize: scaleDim(60),
    readReceiptFontSize: scaleDim(9),
    inputHeight: 48,
    searchInputHeight: 32,
    inputPaddingLeft: 10,
    inputPaddedHeight: 56,
    fabSize: 60,
    fabRight: 16,
    fabBottom: 32,
    retentionOffset,
    iPhoneXBottom,
    iPhoneXTop,
    tabCellHeight,
    tabsHeight: tabCellHeight + iPhoneXBottom,
    spacing: {
        small: {
            mini: scaleDim(2),
            mini2x: scaleDim(4),
            midi: scaleDim(6),
            midi2x: scaleDim(8),
            maxi: scaleDim(10),
            maxi2x: scaleDim(12)
        },
        medium: {
            mini: scaleDim(14),
            mini2x: scaleDim(16),
            midi: scaleDim(18),
            midi2x: scaleDim(20),
            maxi: scaleDim(22),
            maxi2x: scaleDim(24)
        },
        large: {
            mini: scaleDim(25),
            mini2x: scaleDim(30),
            midi: scaleDim(32),
            midixx: scaleDim(34),
            midi2x: scaleDim(36),
            maxi: scaleDim(40),
            maxi2x: scaleDim(48)
        },
        huge: {
            mini: scaleDim(50),
            minixx: scaleDim(54),
            mini2x: scaleDim(56),
            midi: scaleDim(60),
            midi2x: scaleDim(64),
            maxi: scaleDim(74),
            maxi2x: scaleDim(75)
        }
    }
};

vars.iconLayoutSize = vars.iconSize + vars.iconPadding * 2;

export default vars;
