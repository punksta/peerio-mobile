import {
    StyleSheet
} from 'react-native';

import _ from 'lodash';

const vars = {
    circle: 8,
    bg: '#2C95CF',
    highlight: '#FFFFFFCC',
    white: '#FFF',
    whiteIcon: '#fff',
    darkIcon: '#00000070',
    txtLight: '#bfdfef',
    txtDark: 'black',
    inputBg: 'white',
    subtleBg: '#c3dfee',
    subtleText: '#7b8c95',
    subtleTextBold: '#181c1f',
    inputBgInactive: '#c2e0ef',
    inputBgInactiveText: '#7c8e98',
    footerMarginX: 24,
    font: {
        size: {
            normal: 14,
            smaller: 12,
            small: 10,
            big: 18,
            bigger: 16
        }
    }
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

const styles = {
    text: {
        inverse: baseclass('text-inverse', {
            color: vars.txtLight
        })
    },
    shadow: {
        normal: baseclass('shadow-normal', {
            height: 48,
            margin: 2,
            marginBottom: 36,
            marginTop: 6
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
                fontWeight: 'bold'
            }
        }
    },
    input: {
        base: {
            normal: baseclass('input-normal', {
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
                fontSize: 14,
                borderRadius: 2
            }),
            active: baseclass('input-active', inherit('input-normal', {
                color: vars.txtDark
            }))
        },
        normal: {
            textbox: inherit('input-normal'),
            textview: inherit('input-active', {
                top: 24
            }),
            shadow: inherit('shadow-normal', {
                backgroundColor: vars.inputBgInactive
            })
        },
        active: {
            textbox: inherit('input-active'),
            textview: inherit('input-active', {
                top: 24
            }),
            shadow: inherit('shadow-active', {
                backgroundColor: vars.inputBg
            })
        },
        hint: {
            text: {
                color: 'gray',
                fontSize: 12
            },
            full: {
                position: 'absolute',
                top: 18,
                left: 10
            },
            scaled: {
                position: 'absolute',
                top: 6,
                left: 10
                /* transform: [{ scale: 0.8 }]  */
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
            justifyContent: 'center'
        },
        small: {
            base: baseclass('small-circle', {
                width: vars.circle,
                height: vars.circle,
                borderRadius: vars.circle / 2,
                marginLeft: vars.circle,
                marginRight: vars.circle,
                backgroundColor: vars.txtLight
            }),
            normal: inherit('small-circle'),
            active: inherit('small-circle', {
                backgroundColor: vars.highlight
            })
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
            borderColor: 'violet',
            borderWidth: 0,
            backgroundColor: 'transparent',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        textSubTitle: {
            color: vars.txtLight,
            fontWeight: '400',
            fontSize: 22,
            marginTop: 12,
            marginBottom: 30
        },
        textInfo: {
        },
        text: {
            title: inherit('text-inverse'),
            subTitle: inherit('text-inverse', {
                fontWeight: '400',
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
                height: 40,
                flexDirection: 'row'
            },
            button: {
                left: {
                    position: 'absolute',
                    left: vars.footerMarginX,
                    top: 0,
                    height: 40
                },
                right: {
                    position: 'absolute',
                    right: vars.footerMarginX,
                    top: 0,
                    height: 40
                },
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

export default styles;
