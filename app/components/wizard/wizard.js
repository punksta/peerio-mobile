import React from 'react';
import { observer } from 'mobx-react/native';
import { View, LayoutAnimation, BackHandler } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';

@observer
export default class Wizard extends SafeComponent {
    @observable _index = 0;
    @observable pages = [];
    direction = 1;

    get index() { return this._index; }
    set index(i) { this._index = i; }

    constructor(props) {
        super(props);
        reaction(() => this.index, i => {
            LayoutAnimation.easeInEaseOut();
        });
    }

    _handleBack = () => {
        if (this.index > 0) {
            this.index--;
            return true;
        }
        return false;
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBack);
    }

    changeIndex(shift) {
        uiState.hideAll().then(() => { this.index += shift; });
    }

    wizard() {
        // return this.pages.map((k, i) => this._animatedContainer(k, this[k](), i));
        const container = { flexGrow: 1 };
        return (
            <View style={container}>
                {this[this.pages[this.index]]()}
            </View>
        );
    }
}
