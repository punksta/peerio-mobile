import React, { Component } from 'react';
import Bold from './bold';
import Italic from './italic';
import Link from './link';

function a(text, url) {
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
