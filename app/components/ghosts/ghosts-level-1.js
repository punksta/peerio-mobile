import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import GhostView from './ghost-view';
import GhostCompose from './ghost-compose';
import ghostState from './ghost-state';

@observer
export default class GhostsLevel1 extends Component {
    render() {
        return ghostState.isComposing ? <GhostCompose /> : <GhostView />;
    }
}

