const download = require('download-git-repo');
const path = require('path');

module.exports = async (name, dir, opts) => {
    const currDir = path.join(dir, name);

    return new Promise((resolve, reject) => {
        download(opts.path, currDir, { clone: false }, err => {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    });
};
