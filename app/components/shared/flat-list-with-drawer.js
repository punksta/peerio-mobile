import React from 'react';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import { vars } from '../../styles/styles';
import ListWithDrawer from './list-with-drawer';

@observer
export default class FlatListWithDrawer extends ListWithDrawer {
    @action.bound scrollViewRef(sv) {
        this.props.setScrollViewRef && this.props.setScrollViewRef(sv);
        this.scrollView = sv;
    }

    scrollDrawerOutOfView = (animated) => {
        this.scrollView && this.scrollView.scrollToOffset({
            offset: vars.topDrawerHeight,
            animated
        });
    };

    scrollToStart = (animated) => {
        this.scrollView && this.scrollView.scrollToOffset({
            offset: 0,
            animated
        });
    };

    renderThrow() {
        return (
            <FlatList
                {...this.props}
                ref={this.scrollViewRef}
                ListHeaderComponent={this.topDrawer} />
        );
    }
}
