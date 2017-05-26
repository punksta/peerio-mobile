import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import SettingsItem from './settings-item';
import Toggle from './toggle';

@observer
export default class ToggleItem extends SafeComponent {
    get active() {
        return this.props.state[this.props.prop];
    }

    toggle = () => {
        const { onPress } = this.props;
        console.log(this.props.state[this.props.prop]);
        console.log(!this.active);
        onPress && onPress(!this.active);
    }

    renderThrow() {
        return (
            <SettingsItem
                {...this.props}
                untappable icon={null}>
                <Toggle onPress={this.toggle} active={this.active} />
            </SettingsItem>
        );
    }
}

ToggleItem.propTypes = {
    state: React.PropTypes.any,
    prop: React.PropTypes.any,
    title: React.PropTypes.any,
    onPress: React.PropTypes.any
};

