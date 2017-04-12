const _ = require('lodash');
const fs = require('fs');
const o = require('peerio-copy/client_en.json');
const n = require('peerio-copy/icebear_en.json');

const values = {};
const m = {};

_.keys(n).forEach(k => {
    values[n[k]] = k;
});

_.keys(o).forEach(k => {
    const v = o[k];
    if (values[v]) {
        m[k] = values[v];
        // console.log(`${k} => ${values[v]}`);
    }
});

const walkSync = function(dir, filelist) {
    files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        const path = `${dir}/${file}`;
        if (fs.statSync(path).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist);
        }
        else {
            filelist.push(path);
        }
    });
    return filelist;
};

const fileList = [];

walkSync('app/components', fileList);

const parseLine = line => {
    let replaced = false;
    let result = line.replace(/([^a-zA-Z_])(t|tu|tx|T)\('(.*?)'(.*?)\)/g, (match, s, f, t, r) => {
        replaced = true;
        if (m[t] ) {
            const t1 = m[t];
            // console.log(`${t} => ${t1}`);
            // console.log(`${s}${f}('${t1}'${r})`);
            return `${s}${f}('${t1}'${r})`;
        }
        return match;
    });

    result = result.replace(/([^a-zA-Z_]k=)"(.*?)"/g, (match, s, t) => {
        replaced = true;
        if (m[t]) {
            const t1 = m[t];
            // console.log(`${t} => ${t1}`);
            return `${s}"${t1}"`;
        }
        return match;
    });

    return replaced ? result : null;
}

const parseFile = filePath => {
    // console.log(filePath);
    const filePathNew = `${filePath}.tmp`;

    var tempFile = fs.createWriteStream(filePathNew);

    return new Promise(resolve => {
        tempFile.on('open', (fd) => {
            // console.log(`Open ${filePath}`);
            const input = require('fs').createReadStream(filePath);
            const lineReader = require('readline').createInterface({ input });

            lineReader.on('line', function (line) {
                const l = parseLine(line);
                if (l) {
                    console.log(line);
                    console.log(l);
                }
                tempFile.write(`${l || line}\n`);

                // console.log('Line from file:', line);
                });

            input.on('end', function (line) {
                // console.log(`Close ${filePath}`);
                tempFile.end();
                fs.renameSync(filePathNew, filePath);
                resolve(filePath);
            });
        });
    });
};

let chain = Promise.resolve(true);
fileList.forEach(i => (chain = chain.then(() => parseFile(i))));

