import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import Swiper from '../controls/swiper';
import mainState from '../main/main-state';
import fileState from './file-state';

const height = 64;
const checkBoxWidth = height;
const itemContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)',
    backgroundColor: 'white',
    height,
    paddingLeft: 8
};

// const itemBgStyle = {
//     height,
//     backgroundColor: 'yellow',
//     marginBottom: -height
// };

const fileInfoContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    marginLeft: -checkBoxWidth
};

const swipeLeftToRightStyle = {
    borderWidth: 0,
    borderColor: 'green'
};

@observer
export default class FileItem extends Component {
    constructor(props) {
        super(props);
        reaction(() => this.checked, value => {
            fileState.select(this.fileId, value ? this.props.file : null);
        });
    }

    get fileId() {
        const file = this.props.file;
        if (!file || !file.fileId) {
            throw new Error('file-item.js: must specify valid file and file id');
        }
        return file.fileId;
    }

    @observable checked = false

    @observable store = {
        get checkBoxHidden() {
            return !fileState.showSelection;
        },

        set checkBoxHidden(value) {
            this.checkBoxHiddenSelf = value;
        },

        checkBoxHiddenSelf: true,
        actionsVisible: false
    }

    onPress() {
        if (!this.store.checkBoxHidden) {
            this.checked = !this.checked;
        } else {
            // const file = this.props.file;
            // if (file.download) {
            //     const path = `${RNFS.DocumentDirectoryPath}/${file.name}`;
            //     console.log(path);
            //     this.props.file.download(path);
            //     return;
            // }
            mainState.file(this.props.file);
        }
    }

    select() {
        this.checked = true;
    }

    checkbox() {
        const v = vars;
        const color = this.checked ? v.checkboxActive : v.checkboxInactive;
        const iconColor = this.checked ? 'white' : v.checkboxIconInactive;
        const iconBgColor = 'transparent';
        const icon = this.checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: color,
            padding: 4,
            flex: 0,
            width: checkBoxWidth,
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
            <View style={outer} pointerEvents="none">
                {icons.colored(icon, null, iconColor, iconBgColor)}
            </View>
        );
    }

    render() {
        const file = this.props.file;
        const iconLeft = icons.dark('image');
        const iconRight = icons.dark('keyboard-arrow-right');
        const nameStyle = {
            color: vars.txtDark,
            fontSize: 14,
            fontWeight: vars.font.weight.bold
        };
        const infoStyle = {
            color: vars.subtleText,
            fontSize: 12,
            fontWeight: vars.font.weight.regular
        };
        return (
            <Swiper
                state={this.store}
                visible="checkBoxHidden"
                style={swipeLeftToRightStyle}
                shift={checkBoxWidth}
                onSwipeOut={() => this.select()}
                threshold={0.5}
                leftToRight>
                <TouchableOpacity onPress={() => this.onPress()}>
                    {/* <View style={itemBgStyle} pointerEvents="none">
                        <Text>HIDDEN UNDER</Text>
                    </View> */}
                    <View style={fileInfoContainerStyle}>
                        {this.checkbox()}
                        <View style={itemContainerStyle} pointerEvents="none">
                            {iconLeft}
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={nameStyle}>{file.name}</Text>
                                <Text style={infoStyle}>Date - owner</Text>
                            </View>
                            {iconRight}
                        </View>
                    </View>
                </TouchableOpacity>
            </Swiper>
        );
    }
}

FileItem.propTypes = {
    onPress: React.PropTypes.func,
    file: React.PropTypes.any.isRequired
};
