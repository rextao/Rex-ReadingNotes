const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const { prompt } = require('enquirer');
const execa = require('execa');
const currentVersion = require('../package.json').version;
// 可以通过"prepublishOnly": "node ./scripts/release.js",
// 可以通过process.exit(1) 退出后续流程
const versionIncrements = [
    'patch',
    'minor',
    'major',
];

const inc = i => semver.inc(currentVersion, i);
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });
const step = msg => console.log(chalk.cyan(msg));

async function main() {
    let targetVersion;

    const { release } = await prompt({
        type: 'select',
        name: 'release',
        message: 'Select release type',
        choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom']),
    });

    if (release === 'custom') {
        targetVersion = (await prompt({
            type: 'input',
            name: 'version',
            message: 'Input custom version',
            initial: currentVersion,
        })).version;
    } else {
        targetVersion = release.match(/\((.*)\)/)[1];
    }

    if (!semver.valid(targetVersion)) {
        throw new Error(`Invalid target version: ${targetVersion}`);
    }

    step('\nUpdating the package version...');
    updatePackage(targetVersion);

    // Build the package.
    step('\nBuilding the package...');
    await run('yarn', ['lib']);


    step('\n 请手动执行 npm publish');
}

function updatePackage(version) {
    const pkgPath = path.resolve(path.resolve(__dirname, '..'), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    pkg.version = version;

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

main().catch(err => console.error(err));
