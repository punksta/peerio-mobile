module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: [
        "peerio"
    ],
    rules:{
        'global-require': 0,
        'generator-star-spacing': 0,
        'react/prefer-stateless-function': 0,
        'react/jsx-filename-extension': 0,
        'react/sort-comp': 0,
        'no-mixed-operators': 0,
        'new-cap': 0,
        'prefer-rest-params': 0
    },
    globals: {
        'requestAnimationFrame': false,
        '__DEV__': false,
        '__PROD__': false
    }
};
