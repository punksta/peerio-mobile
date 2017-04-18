const fs = require('fs');
const glob = require('glob');

const keys = require('peerio-copy/icebear_en');


glob('app/components/**/*.js', (err, files) => {
    for (const i of files) {
        const file = fs.readFileSync(i, 'utf8');
        const re = /[^a-zA-Z_](t|tx|tu)\('(.*?)'/gm;
        let matches = re.exec(file);
        while (matches != null) {
            const k = matches[2];
            if (typeof keys[k] === 'undefined') {
                console.log(i);
                console.log(k);
            }
            matches = re.exec(file);
        }
    }
});
