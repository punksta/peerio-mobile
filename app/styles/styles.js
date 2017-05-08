import { StyleSheet } from 'react-native';
import _ from 'lodash';
import branding from './branding';
import vars from './vars';
import textbox from './textbox';
import button from './button';
import circles from './circles';
import pickerBox from './picker-box';
import pin from './pin';
import wizard from './wizard';
import navigator from './navigator';
import common from './common';
import debug from './debug';

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
            shadowOpacity: 0.4,
            shadowRadius: 5,
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
                flexGrow: 1,
                marginLeft: 10,
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
            height: 10,
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
                backgroundColor: vars.bg,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)'
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
            subTitle: inherit('text-inverse', {
                fontWeight: vars.font.weight.regular,
                fontSize: 22,
                marginTop: 12,
                marginBottom: 10


            }),
            container: {
                height: 50,
                justifyContent: 'space-between'
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
        containerFlexGrow: {
            flexGrow: 1,
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
                fontSize: 24,
                marginTop: 12,
                marginBottom: 32
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
                    height: 60,
                    margin: 0,
                    padding: 20
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
    }),
    baseclass,
    inherit,
    vars,
    branding
};

const helpers = {
    circle(size) {
        return {
            width: size,
            height: size,
            borderRadius: size / 2
        };
    }
};

export {
    vars,
    helpers,
    textbox,
    button,
    circles,
    pickerBox,
    pin,
    common,
    wizard,
    navigator,
    debug,
    branding
};

export default styles;
