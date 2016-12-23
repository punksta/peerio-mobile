import React, { Component } from 'react';
import {
    ActivityIndicator
} from 'react-native';
import { observer } from 'mobx-react/native';

import mainState from './main-state';

@observer
export default class MainStateLoading extends Component {
    render() {
        return mainState.loading ?
            <ActivityIndicator style={{ paddingTop: 10 }} /> : this.props.children;
    }
}

MainStateLoading.propTypes = {
    children: React.PropTypes.any
};

