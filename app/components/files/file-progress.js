import React, { Component } from 'react';
import {
    View,
    Animated
} from 'react-native';
import { observable, autorun, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';

@observer
export default class FileProgress extends Component {
    @observable width = 0;
    prevFile = null;

    get hidden() {
        const file = this.props.file;
        return !file || (!file.downloading && !file.uploading);
    }

    get value() {
        const file = this.props.file;
        if (!file) return 0;
        let max = 0;
        if (file.downloading) {
            max = file.size | 1;
        }
        if (file.uploading) {
            max = file.progressMax | 1;
        }
        return (this.width * file.progress / max) | 0;
    }

    progress = new Animated.Value(0);

    layout(evt) {
        this.width = evt.nativeEvent.layout.width;
        reaction(() => this.props.file, file => {
            if (file !== this.prevFile) {
                this.prevFile = file;
                this.progress.setValue(this.value);
            }
        }, true);
        autorun(() => {
            if (this.hidden) return;
            const toValue = this.value;
            const duration = 3000;
            console.log(this.progress);
            toValue < this.progress._toValue ?
                this.progress.setValue(0) :
                Animated.timing(this.progress, { toValue, duration }).start();
        });
    }

    render() {
        const height = this.hidden ? 0 : 4;

        const pbContainer = {
            marginTop: -height,
            height,
            backgroundColor: '#CFCFCF',
            flex: 1
        };
        const pbProgress = {
            height,
            backgroundColor: vars.bg,
            width: this.progress
        };

        return (
            <View style={pbContainer} onLayout={evt => this.layout(evt)}>
                <Animated.View style={pbProgress} />
            </View>
        );
    }
}

FileProgress.propTypes = {
    file: React.PropTypes.any
};

