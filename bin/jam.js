#!/usr/bin/env node

const semver = require('semver');
const chalk  = require('chalk');
const inquirer = require('inquirer');
const requiredNodeVersion = require('../package.json').engines.node;

function checkNodeVersion(requireVersion) {
    if (!semver.satisfies(process.version, requireVersion)) {
        console.log(chalk.red(
            `You are useing node ${process.version}, but this require Node ${requireVersion}.
            Please Upgrade your Node version.`
        ));
        process.exit(1);
    }
}

// check node version
checkNodeVersion(requiredNodeVersion);

const program = require('commander');

program
    .version(require('../package.json').version)
    .usage('<command> [options]');

program
    .command('create <app-name>')
    .description('create a new project')
    .option('-p, --preset <presetName>', 'skip prompts and use configured preset')
    .action(async (name, cmd) => {
        const options = cleanArgs(cmd);
        if (!options.preset) {
            const config = require('../lib/config.json');
            const { preset } = await inquirer.prompt([
                {
                    name: 'preset',
                    type: 'list',
                    message: 'Please pick a preset: ',
                    choices: Object.keys(config).map(key => {
                        return {
                            name: key,
                            value: key
                        };
                    })
                }
            ]);

            options.preset = preset;
        }

        require('../lib/load')(name, options);
    });
    
program.parse(process.argv);

function camelize (str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
  }

function cleanArgs (cmd) {
    const args = {};

    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''));
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key];
        }
    })
    return args;
}