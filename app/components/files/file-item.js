import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import Swiper from '../controls/swiper';
import FileProgress from './file-progress';
import FileInnerItem from './file-inner-item';
import fileState from './file-state';
import routerMain from '../routes/router-main';

const height = 64;
const checkBoxWidth = height;

const swipeLeftToRightStyle = {
    borderWidth: 0,
    borderColor: 'green'
};

@observer
export default class FileItem extends Component {
    @observable store = {
        get checkBoxHidden() {
            return !fileState.showSelection;
        },

        set checkBoxHidden(value) {
            // noop
        }
    }

    select() {
        this.props.file.selected = true;
    }

    press(file) {
        if (fileState.showSelection) {
            file.selected = !file.selected;
        } else {
            routerMain.files(file);
        }
    }

    render() {
        const file = this.props.file;
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Swiper
                    state={this.store}
                    visible="checkBoxHidden"
                    style={[swipeLeftToRightStyle]}
                    shift={checkBoxWidth}
                    onSwipeOut={() => this.select()}
                    threshold={0.5}
                    leftToRight>
                    <FileInnerItem onPress={f => this.press(f)} file={file} />
                </Swiper>
                <FileProgress file={file} />
            </View>
        );
    }
}

FileItem.propTypes = {
    file: React.PropTypes.any.isRequired
};
