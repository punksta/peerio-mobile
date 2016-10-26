import React, { Component } from 'react';
import { Text } from 'react-native';
import { t } from 'peerio-translator';
import { reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import state from '../layout/state';

@observer
class T extends Component {
    componentDidMount() {
        this.localeUpdateReaction = reaction(() => state.locale, () => {
            console.log('update reaction');
            this.forceUpdate();
            // this.nav && this.nav.forceUpdate();
        });
    }

    componentWillUnmount() {
        // console.log('umount');
        this.localeUpdateReaction && this.localeUpdateReaction();
    }

    render() {
        const translated = t(this.props.k, this.props.children);
        if (Array.isArray(translated)) {
            return (
                <Text>
                    {translated.map((o, i) => <Text key={i}>{o}</Text>)}
                </Text>
            );
        }
        return <Text>{translated}</Text>;
    }
}

T.propTypes = {
    children: React.PropTypes.any,
    k: React.PropTypes.string
};

module.exports = {
    T,
    t(k, params) {
        return React.createElement(T, { k }, params);
    }
};
