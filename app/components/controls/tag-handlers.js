import React from 'react';
import Bold from './bold';
import Italic from './italic';
import Link from './link';
import routes from '../routes/routes';

function a(text, url) {
    console.log(`tag-handlers: ${text} ${url}`);
    if (!url) {
        console.error(`tag-handlers.js: bad ${text} link`);
        return text;
    }
    if (url.startsWith('route:')) {
        const [, type, route] = url.split(':');
        const action = routes[type][route];
        if (action) return <Link onPress={action}>{text}</Link>;
    }
    return <Link key={url} url={url}>{text}</Link>;
}

function b(text) {
    return <Bold key={text}>{text}</Bold>;
}

function i(text) {
    return <Italic key={text}>{text}</Italic>;
}

module.exports = {
    a, b, i
};
