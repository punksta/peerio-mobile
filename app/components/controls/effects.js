import React from 'react';
// very smart plugin developer ships two different files for iOS and Android
import LinearGradient from 'react-native-linear-gradient'; // eslint-disable-line
import { vars } from '../../styles/styles';

function gradient(props, inner) {
    props.colors = [vars.bg, vars.bgGradient];
    props.start = { x: 0.0, y: 0.0 };
    props.end = { x: 1.0, y: 0.0 };
    return React.createElement(LinearGradient, props, inner);
}

gradient.propTypes = {
    colors: React.PropTypes.any,
    start: React.PropTypes.any,
    end: React.PropTypes.any
};

const effects = {
    gradient
};

export { gradient };
export default effects;
