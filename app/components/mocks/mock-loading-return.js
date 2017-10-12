import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import LoadingReturn from '../layout/loading-return';


@observer
export default class MockLoadingReturn extends Component {
    render() {
        return <LoadingReturn />;
    }
}
