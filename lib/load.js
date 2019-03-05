const chalk  = require('chalk');
const loadRemotePreset = require('./loadRemotePreset');

async function create(name, options) {
    const { preset } = options;
    if (!preset) {
        throw new Error('no set preset option');
    }

    const config = require('./config');
    if (!config[preset]) {
        throw new Error(`preset ${preset} no valid`);
    }

    const opts = config[preset];
    const dir = process.cwd();
    switch(opts.type) {
        case 'repo':
            return await loadRemotePreset(name, dir, opts);
    }
}

module.exports = (...args) => {
    return create(...args).catch(err => {
        console.log(chalk.red(
            `create app error msg----- ${err} .`
        ));

        process.exit(1);
    })
};
