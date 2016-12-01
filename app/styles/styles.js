import {
    StyleSheet
} from 'react-native';

import _ from 'lodash';

const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';
console.log(`Branding ${EN}`);

const branding = {
    name: EN,
    peeriomobile: {
        bg: '#2C95CF'
    },
    expandoo: {
        bg: '#009dfd'
    }
};

const { bg } = branding[EN];

const statusBarHeight = global.platform === 'android' ? 0 : 10;
const layoutPaddingTop = statusBarHeight * 2;

const vars = {
    circle: 8,
    bg,
    highlight: '#FFFFFFCC',
    midlight: '#FFFFFF55',
    white: '#fff',
    whiteIcon: '#fff',
    darkIcon: '#00000070',
    txtLight: '#bfdfef',
    txtAlert: '#ff0000aa',
    txtDark: 'rgba(0, 0, 0, .87)',
    inputBg: 'white',
    pickerBg: 'rgba(255, 255, 255, .12)',
    pickerText: 'white',
    subtleBg: '#c3dfee',
    subtleText: 'rgba(0, 0, 0, .54)',
    subtleTextBold: 'rgba(0, 0, 0, .54',
    inputBgInactive: 'rgba(255, 255, 255, .5)',
    inputBgInactiveText: 'rgba(0,0,0, .54)',
    checkboxInactive: 'rgba(0, 0, 0, .12)',
    checkboxIconInactive: 'rgba(0, 0, 0, .54)',
    checkboxActive: '#23d089',
    snackbarBg: '#4a4a4a',
    snackbarHeight: 48,
    footerMarginX: 24,
    statusBarHeight,
    layoutPaddingTop,
    headerHeight: 56,
    headerSpacing: 56 + layoutPaddingTop,
    iconSize: 24,
    iconPadding: 12,
    menuWidthRatio: 0.8,
    animationDuration: 200,
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
    inputHeight: 48
};

const styleCache = {};
function baseclass(name, style) {
    styleCache[name] = style;
    return style;
}

function inherit(name, item) {
    if (_.isObject(name)) {
        const result = {};
        return _.merge(result, name, item);
    }
    if (!styleCache[name]) throw Error(`#peerio-mobile#styles.js Style not found ${name}`);
    const items = [];
    items.push(styleCache[name]);
    if (item) items.push(item);
    return StyleSheet.flatten(items);
}

function merge(style1, style2) {
    const result = {};
    return _.merge(result, style1, style2);
}

const styles = {
    text: {
        inverse: baseclass('text-inverse', {
            color: vars.txtLight
        })
    },
    shadow: {
        normal: baseclass('shadow-normal', {
            height: vars.inputHeight,
            margin: 2,
            marginBottom: 36,
            marginTop: 6,
            backgroundColor: vars.inputBg
        }),
        active: baseclass('shadow-active', inherit('shadow-normal', {
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowOffset: {
                height: 1,
                width: 1
            }
        }))
    },
    button: {
        text: {
            normal: {
                color: vars.highlight
            },
            bold: {
                color: vars.highlight,
                fontWeight: vars.font.weight.bold
            }
        }
    },
    hint: baseclass('hint', {
        view: {
            position: 'absolute',
            top: 6,
            left: 10
        },
        text: {
            color: 'gray',
            fontSize: 12,
            backgroundColor: 'transparent'
        }
    }),
    inputContainer: baseclass('input-container', {
        height: vars.inputHeight,
        opacity: 1

    }),
    input: {
        base: {
            normal: baseclass('input-base', {
                position: 'absolute',
                left: 10,
                right: 0,
                bottom: 0,
                top: 20,
                height: 28,
                backgroundColor: 'transparent',
                borderColor: 'yellow',
                borderWidth: 0,
                color: vars.inputBgInactiveText,
                fontSize: 14
            }),
            active: baseclass('input-active', inherit('input-base', {
                color: vars.txtDark
            }))
        },
        normal: {
            textbox: inherit('input-base'),
            textview: inherit('input-active', {
                top: 24
            }),
            shadow: inherit('shadow-normal', {
                backgroundColor: 'transparent'
            }),
            background: {
                backgroundColor: vars.inputBg
            },
            container: inherit('input-container', {
                backgroundColor: vars.subtleBg
            }),
            hint: inherit('hint'),
            iconContainer: {
                position: 'absolute',
                right: 2,
                top: 2
            },
            icon: {
                backgroundColor: 'transparent'
            }
        },
        active: {
            textbox: inherit('input-active'),
            textview: inherit('input-active', {
                top: 24
            }),
            shadow: inherit('shadow-active', {
                backgroundColor: 'transparent'
            }),
            background: {
                backgroundColor: vars.inputBg
            },
            hint: inherit('hint'),
            container: inherit('input-container', {
                backgroundColor: 'transparent'
            }),
            iconContainer: {
                position: 'absolute',
                right: 2,
                top: 2
            },
            icon: {
                backgroundColor: 'transparent'
            }
        },
        hint: {
            text: {
                color: 'gray',
                fontSize: 12,
                backgroundColor: 'transparent'
            },
            full: {
                position: 'absolute',
                top: 18,
                left: 10
            },
            scaled: {
                position: 'absolute',
                top: 18,
                left: 10
                /* transform: [{ scale: 0.8 }]  */
            }
        }
    },
    pickerBox: {
        normal: {
            textbox: inherit('input-base'),
            textview: inherit('input-active', {
                color: vars.pickerText,
                top: 16
            }),
            shadow: inherit('shadow-normal', {
                backgroundColor: 'transparent'
            }),
            background: {
                backgroundColor: 'transparent'
            },
            container: inherit('input-container', {
                backgroundColor: vars.pickerBg,
                borderRadius: 2,
                overflow: 'hidden'
            }),
            iconContainer: {
                position: 'absolute',
                right: 2,
                top: 2
            },
            icon: {
                backgroundColor: 'transparent'
            }
        },
        active: {
            textbox: inherit('input-active'),
            textview: inherit('input-active', {
                top: 16
            }),
            shadow: inherit('shadow-active', {
                backgroundColor: 'transparent'
            }),
            background: {
                backgroundColor: vars.inputBg,
                borderRadius: 2,
                overflow: 'hidden'
            },
            hint: inherit('hint'),
            container: inherit('input-container', {
                backgroundColor: 'transparent'
            }),
            iconContainer: {
                position: 'absolute',
                right: 2,
                top: 2
            },
            icon: {
                backgroundColor: 'transparent'
            }
        }
    },
    container: StyleSheet.create({
        root: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: vars.bg
        },
        footer: {
        }
    }),
    circle: {
        container: {
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        small: {
            base: baseclass('small-circle', {
                width: vars.circle,
                height: vars.circle,
                borderRadius: vars.circle / 2,
                marginLeft: vars.circle,
                marginRight: vars.circle,
                backgroundColor: vars.midlight
            }),
            normal: inherit('small-circle'),
            active: inherit('small-circle', {
                backgroundColor: vars.highlight
            })
        },
        create(size, style) {
            return merge({
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: vars.txtLight
            }, style);
        }
    },
    pin: {
        message: {
            text: inherit('text-inverse'),
            container: {
                marginBottom: 0
            }
        }
    },
    wizard: {
        containerNoPadding: {
            paddingTop: 0,
            borderColor: 'red',
            borderWidth: 0,
            backgroundColor: 'transparent'
        },
        container: {
            padding: 50,
            paddingTop: 0,
            backgroundColor: 'transparent',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        containerFlex: {
            flex: 1,
            padding: 50,
            paddingTop: 0,
            paddingBottom: 0,
            borderColor: 'violet',
            borderWidth: 0,
            backgroundColor: 'transparent',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        textSubTitle: {
            color: vars.txtLight,
            fontWeight: vars.font.weight.regular,
            fontSize: 22,
            marginTop: 12,
            marginBottom: 30
        },
        textInfo: {
        },
        text: {
            title: inherit('text-inverse'),
            subTitle: inherit('text-inverse', {
                fontWeight: vars.font.weight.regular,
                fontSize: 22,
                marginTop: 12,
                marginBottom: 30
            }),
            info: inherit('text-inverse', {
                fontSize: 12
            })
        },
        footer: {
            row: {
                height: 48,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 20
            },
            button: {
                base: {
                    height: 36,
                    margin: 0,
                    marginLeft: 8,
                    marginRight: 8,
                    padding: 0,
                    paddingLeft: 16,
                    paddingRight: 16
                },

                left: {},
                right: {},
                text: {
                    color: 'white'
                }
            }
        }
    },
    navigator: StyleSheet.create({
        router: {
            backgroundColor: vars.bg
        },
        card: {
            flex: 1,
            backgroundColor: vars.bg,
            shadowColor: 'black',
            shadowOffset: { height: 1, width: -1 },
            shadowOpacity: 0.2,
            shadowRadius: 5
        }
    })
};
styles.baseclass = baseclass;
styles.inherit = inherit;
styles.vars = vars;
styles.branding = branding;


export default styles;
