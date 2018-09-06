import React from 'react';
import { SectionList } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import { vars } from '../../styles/styles';
import ListWithDrawer from './list-with-drawer';

@observer
export default class SectionListWithDrawer extends ListWithDrawer {
    @action.bound
    scrollViewRef(sv) {
        this.props.setScrollViewRef && this.props.setScrollViewRef(sv);
        this.scrollView = sv;
    }

    scrollDrawerOutOfView = animated => {
        try {
            // TODO: undocumented react-native reference
            // subject to change
            this.scrollView._wrapperListRef._listRef.scrollToOffset({
                offset: vars.topDrawerHeight,
                animated
            });
        } catch (e) {
            console.error(e);
        }
    };

    scrollToStart = animated => {
        try {
            // TODO: undocumented react-native reference
            // subject to change
            this.scrollView._wrapperListRef._listRef.scrollToOffset({
                offset: 0,
                animated
            });
        } catch (e) {
            console.error(e);
        }
    };

    renderThrow() {
        return (
            <SectionList
                {...this.props}
                ref={this.scrollViewRef}
                ListHeaderComponent={this.topDrawer}
            />
        );
    }
}
