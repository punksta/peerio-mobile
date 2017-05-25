import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import Swiper from '../controls/swiper';
import FileProgress from './file-progress';
import FileInnerItem from './file-inner-item';
import fileState from './file-state';

const height = 64;
const checkBoxWidth = height;

const swipeLeftToRightStyle = {
    borderWidth: 0,
    borderColor: 'green'
};

export default class FileItem extends SafeComponent {
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
            fileState.routerMain.files(file);
        }
    }

    renderThrow() {
        const file = this.props.file;
        return (
            <View style={{ backgroundColor: 'white' }}>
                <FileInnerItem onPress={f => this.press(f)} file={file} />
                <FileProgress file={file} />
            </View>
        );
    }
}

FileItem.propTypes = {
    file: React.PropTypes.any.isRequired
};
