/* eslint-disable */
const fs = require('fs');
const glob = require('glob');

glob('app/components/**/*.js', (err, files) => {
    for (const i of files) {
        const file = fs.readFileSync(i, 'utf8');
        const re = /['>"]([A-Z].*?)['<]/gm;
        let matches = re.exec(file);
        while (matches != null) {
            const k = matches[0];
            console.log(i);
            console.log(k);
            matches = re.exec(file);
        }
    }
});
