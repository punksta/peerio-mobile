import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import GhostView from './ghost-view';
import GhostCompose from './ghost-compose';
import ghostState from './ghost-state';

@observer
export default class GhostsLevel1 extends SafeComponent {
    renderThrow() {
        return ghostState.isComposing ? <GhostCompose /> : <GhostView />;
    }
}

