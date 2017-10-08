import React from 'react';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import Option from './radio-button-option';

export default class RadioButton extends SafeComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1
        };
    }

    _onSelect(index) {
        const { onSelect } = this.props;
        this.setState({
            selectedIndex: index
        });
        onSelect(index);
    }

    render() {
        const { selectedIndex } = this.state;
        const targetIndex = selectedIndex !== -1 ? selectedIndex : this.props.defaultSelect;

        const children = React.Children.map(this.props.children, (child, index) => {
            if (child.type === Option) {
                return React.cloneElement(child, {
                    onPress: () => this._onSelect(index),
                    isSelected: index === targetIndex
                });
            }

            return child;
        });

        return (
            <View>
                {children}
            </View>
        );
    }
}

RadioButton.propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    defaultSelect: React.PropTypes.number,
    optionTitles: React.PropTypes.any
};

RadioButton.defaultProps = {
    defaultSelect: -1
};

