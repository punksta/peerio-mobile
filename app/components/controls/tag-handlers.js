import React from 'react';
import Bold from './bold';
import Italic from './italic';
import Link from './link';
import routes from '../routes/routes';

function a(text, url) {
    if (url.startsWith('route:')) {
        const [, type, route] = url.split(':');
        const action = routes[type][route];
        if (action) return <Link onPress={action}>{text}</Link>;
    }
    return <Link url={url}>{text}</Link>;
}

function b(text) {
    return <Bold>{text}</Bold>;
}

function i(text) {
    return <Italic>{text}</Italic>;
}

module.exports = {
    a, b, i
};
