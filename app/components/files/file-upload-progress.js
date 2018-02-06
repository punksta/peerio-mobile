import React from 'react';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ProgressWide from '../shared/progress-wide';

@observer
export default class FileUploadProgress extends SafeComponent {
    get max() {
        const { file } = this.props;
        const max = file.progressMax || 1;
        return max;
    }

    get value() {
        const { file } = this.props;
        return file.progress;
    }

    @action.bound cancel() {
        this.props.file.cancelUpload();
    }

    renderThrow() {
        const { file } = this.props;
        if (!file) return null;
        return (
            <ProgressWide
                title={file.name}
                {...this.props}
                onCancel={this.cancel}
                value={this.value}
                max={this.max} />
        );
    }
}
