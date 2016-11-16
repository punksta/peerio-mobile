import React, { Component } from 'react';
import { Text } from 'react-native';
import { t } from 'peerio-translator';
import { reaction } from 'mobx';
import state from '../layout/state';

class T extends Component {
    componentDidMount() {
        this.localeUpdateReaction = reaction(() => state.locale, () => {
            // console.log('update reaction');
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        // console.log('umount');
        this.localeUpdateReaction && this.localeUpdateReaction();
    }

    render() {
        let translated = t(this.props.k, this.props.children);
        if (Array.isArray(translated)) {
            return (
                <Text>
                    {translated.map((o, i) => <Text key={i}>{o}</Text>)}
                </Text>
            );
        }
        if (this.props.uppercase) {
            translated = translated.toUpperCase();
        }
        return <Text>{translated}</Text>;
    }
}

T.propTypes = {
    children: React.PropTypes.any,
    k: React.PropTypes.string,
    uppercase: React.PropTypes.bool
};

module.exports = {
    T,
    t(k, params) {
        return React.createElement(T, { k }, params);
    },
    tu(k, params) {
        return React.createElement(T, { k, uppercase: true }, params);
    }
};
