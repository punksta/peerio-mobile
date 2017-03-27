import React from 'react';
import { Text, Linking } from 'react-native';
import * as linkify from 'linkifyjs-peerio';
import { vars } from '../../styles/styles';

export default (m) => {
    const tagify = (t, r, s, n) => {
        return t.split(r).map((token, i) => {
            return <Text key={i} style={i % 2 ? s : null}>{n ? n(token) : token}</Text>;
        });
    };
    const tagifyB = (t) => tagify(t, /<\/*b>/, { fontWeight: 'bold' });
    const tagifyI = (t) => tagify(t, /<\/*i>/, { fontStyle: 'italic' }, tagifyB);
    const items = linkify.tokenize(m).map((token, i) => {
        const p = token.isLink ? () => {
            Linking.openURL(token.toHref());
        } : null;
        const str = token.toString();
        const t = token.isLink ? str : tagifyI(str);
        const s = token.isLink ? {
            textDecorationLine: 'underline',
            color: vars.bg
        } : null;
        return <Text onPress={p} key={i} style={s}>{t}</Text>;
    });
    return items;
};
