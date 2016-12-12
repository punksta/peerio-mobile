import React, { Component } from 'react';
import {
    View,
    Animated
} from 'react-native';
import { reaction, autorun, observable, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import { vars } from '../../styles/styles';

@observer
export default class FileProgress extends Component {
    @observable width = 0;

    @computed get file() {
        return this.props.file || mainState.currentFile;
    }

    // constructor(props) {
    //     super(props);
    //     // autorun(() => {
    //     //     const file = this.file;
    //     //     if (!file) return;
    //     //     if (!file.animatedProgress) {
    //     //         file.animatedProgress = new Animated.Value(0);
    //     //     }
    //     //     if (!file.downloading && !file.uploading) {
    //     //         return;
    //     //     }
    //     //     const animatedProgress = file.animatedProgress;
    //     //     const progress = this.width * file.progress / (file.size | 1) | 0;
    //     //     if (!progress) return;
    //     //     const complete = progress === this.width;
    //     //     const duration = complete ? 100 : 3000;
    //     //     console.log('file-view.js: ', progress);
    //     //     Animated.timing(animatedProgress, {
    //     //         toValue: progress, duration }).start(complete ? () => {
    //     //             file.animatedProgress = null;
    //     //         } : null);
    //     // });
    // }

    componentWillReceiveProps() {
        this.forceUpdate();
    }

    layout(evt) {
        const { width } = evt.nativeEvent.layout;
        this.width = width;
    }

    render() {
        const file = this.file;
        let height = 4;
        if (!file || !file.downloading && !file.uploading) height = 0;
        let progress = 0;
        if (file) {
            progress = this.width * file.progress / (file.size | 1) | 0;
            // progress = file.animatedProgress || 0;
        }

        const pbContainer = {
            height,
            backgroundColor: '#CFCFCF',
            flex: 1
        };
        const pbProgress = {
            height,
            backgroundColor: vars.bg,
            width: progress
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

