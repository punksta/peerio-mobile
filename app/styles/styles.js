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

var base_styles = {};
function baseclass(name, style) {
    base_styles[name] = style;
    return style;
}

function inherit(name, item) {
    if(!base_styles[name]) throw 'Style not found ' + name;
    var items = [];
    items.push(base_styles[name]);
    item && items.push(item);
    return StyleSheet.flatten(items);
}

export const styles = {
    text: {
        inverse: baseclass('text-inverse', {
            color: vars.txtLight
        })
    },
    shadow: {
        normal: baseclass('shadow-normal', {
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
    input: {
        base: {
            normal: baseclass('input-normal', {
                height: 48,
                backgroundColor: vars.inputBgInactive,
                color: vars.inputBgInactiveText,
                padding: 10,
                fontSize: 14,
                borderRadius: 2
            }),
            active: baseclass('input-active', inherit('input-normal', {
                height: 48,
                backgroundColor: vars.inputBg,
                color: vars.txtDark,
            }))
        },
        normal: {
            textbox: inherit('input-normal'),
            shadow: inherit('shadow-normal')
        },
        active: {
            textbox: inherit('input-active'),
            shadow: inherit('shadow-active')
        }
    },
    container: StyleSheet.create({
        root: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: 28,
            backgroundColor: vars.bg
        },
        footer: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0
        },
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
                borderRadius: vars.circle/2,
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
        container: {
            flex: 1,
            padding: 50,
            paddingTop: 0,
            borderColor: 'red',
            borderWidth: 0,
            backgroundColor: 'transparent'
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
        card: {
            backgroundColor: vars.bg,
            shadowColor: 'black',
            shadowOffset: { height: 1, width: -1 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
        }
    })
};
