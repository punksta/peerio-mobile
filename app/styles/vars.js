import { Platform, Dimensions, PixelRatio } from 'react-native';
import branding from './branding';

const { bg, bgGradient, tabsBg, tabsFg } = branding;

const statusBarHeight = Platform.OS === 'android' ? 0 : 10;
const layoutPaddingTop = statusBarHeight * 2;

const r = 40;
const retentionOffset = { top: r, left: r, bottom: r, right: r };

const { height } = Dimensions.get('window');
const pixRatio = PixelRatio.get();
console.log({ height, pixRatio });

const defaultHeight = 667;

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
            smaller: 12,
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
    login: {
    },
    loginAutomatic_buttonContainer_margV: scaleDim(20),
    loginAutomatic_button_pad: scaleDim(12),
    loginAutomatic_normalText_margB: scaleDim(22),
    loginClean_header2_margB: scaleDim(20),
    loginClean_formStyle_pad: scaleDim(20),
    loginPassword_textStyle_margB: scaleDim(12),
    loginSaved_body_margT: scaleDim(20),
    loginStart_render_padB: scaleDim(20),
    loginWizardPage_padding: scaleDim(20),
    loginWizardPage_header_margB: scaleDim(12),
    loginWizardPage_inner_padT: scaleDim(12),
    loginWizardPage_title1_margB: scaleDim(10),
    loginWizardPage_title1Black_margB: scaleDim(20),
    loginWizardPage_title2Black_margH: scaleDim(60),
    loginWizardPage_title2Black_margV: scaleDim(6),
    loginWizardPage_buttonContainer_margV: scaleDim(20),
    loginWizard_s_pad: scaleDim(4),
    loginWizard_input_marginH: scaleDim(24),
    loginWizard_input_marginT: scaleDim(12),
    loginWizard_debugMenu_paddingH: scaleDim(24)
};

vars.iconLayoutSize = vars.iconSize + vars.iconPadding * 2;

export default vars;
