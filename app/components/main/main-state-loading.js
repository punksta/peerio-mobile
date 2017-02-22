import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import ProgressOverlay from '../shared/progress-overlay';
import mainState from './main-state';

@observer
export default class MainStateLoading extends Component {
    render() {
        return <ProgressOverlay enabled={mainState.loading} />;
    }
}

MainStateLoading.propTypes = {
    children: React.PropTypes.any
};

