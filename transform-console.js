const fs = require('fs');
const glob = require('glob');

const consoleRegex = /console\.(log|error|warn|debug)\(/gm;
const nameRegex = /^.*[\\/]/;

glob('./**/*.js', (err, files) => {
    for (const path of files) {
        const name = path.replace(nameRegex, '');
        const code = fs.readFileSync(path, 'utf8');
        const compiled = code.replace(consoleRegex, 'console.$1(\''+name+': \'+');
        if(code !== compiled) fs.writefileSync(path, compiled);
    }
});

