import React from 'react';
import SafeComponent from '../shared/safe-component';
import GhostView from './ghost-view';
import GhostCompose from './ghost-compose';
import ghostState from './ghost-state';

export default class GhostsLevel1 extends SafeComponent {
    renderThrow() {
        return ghostState.isComposing ? <GhostCompose /> : <GhostView />;
    }
}

