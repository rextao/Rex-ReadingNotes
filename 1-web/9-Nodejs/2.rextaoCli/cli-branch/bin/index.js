#! /usr/bin/env node

const prompts = require('prompts');
const chalk = require('chalk');
const open = require('open');


const config = {
    workSpace: '/Users/rextao',
    branchAlias: ['wt-', 'wangtao-']
};
let searchUrl = ''; // 类似于：xxxxxxxadmin/-/branches/all?utf8=✓&search=wt-  地址
let isOpenUrl = false;
const simpleGit = require('simple-git/promise')(config.workSpace);

const branchCache = {
    current: '',
    local: {},
    merged: [], // 远程远程仓库已经merged分支，即通过--merged获取
    readyDelete: [], // 准备删除的，用户选择的，或全部删除的列表
};


(async function init() {
    await getLocalBranches(); // 要先获取本地分支，再切换到develop，最后再切换回当前分支
    await getSearchUrl(); // 可能是不同项目，search地址不同
    await developPull(); // 不拉最新的develop代码，不能准确获取已合并分支
    try {
        await getMergedBranches(); // 获取merged分支
        await confirmModeSelect(); // 选择删除模式
        await confirmOpenUrl(); // 选择是否打开网页，确定分支已经合并，避免误删
        const isDelete = await confirmDeleteBranches(); // 确定删除远程分支
        // 如确定要删除
        if (isDelete) {
            await deleteRemoteTracking(); // 确定删除本地分支
        }
    } finally {
        await co(branchCache.current);
    }
})()
// 删除远程分支tracking
async function deleteRemoteTracking() {
    await branchCache.readyDelete.map(async (item) => {
        try {
            await simpleGit.raw(['branch', '-r', '-d', `origin/${item}`]);
            await simpleGit.push('origin', `:${item}`);
            console.log(chalk.green(`${item}远程分支删除成功`));
            await confirmDeleteLocalBranch();
        } catch (e) {
            console.log(e);
        }
    });

}
// 获取branch查询地址，查看当前分支是否已经合并到develop，避免删错
async function getSearchUrl() {
    const remotes = await simpleGit.getRemotes(true);
    const {
        refs
    } = remotes.filter(item => item.name === 'origin')[0];
    searchUrl = refs.fetch.match(/git@(.*)\.git/)[1].replace(':', '/');
}
// 拉取develop分支最新内容
async function developPull() {
    await co(); // 切换到develop分支
    const a = await simpleGit.pull();
}
// 是否删除本地分支
async function confirmDeleteLocalBranch() {
    const {
        value
    } = await prompts({
        type: 'toggle',
        name: 'value',
        message: '是否删除本地分支?',
        active: 'Yes',
        inactive: 'No'
    });
    if (value) {
        branchCache.readyDelete.map(async (item) => {
            try {
                await simpleGit.deleteLocalBranch(`${item}`);
                console.log(chalk.green(`本地分支删除成功`));
            } catch (e) {
                console.log(e);
            }
        });
    }
}
// 删除模式选择
async function confirmModeSelect() {
    const {
        value
    } = await prompts({
        type: 'toggle',
        name: 'value',
        message: '选择删除分支模式?',
        active: '删除全部',
        inactive: '选择删除'
    });
    // 选择全部删除时
    if (value) {
        branchCache.readyDelete = branchCache.merged;
    } else { //选择删除
        const {
            value
        } = await prompts({
            type: 'multiselect',
            name: 'value',
            message: '选择要删除的分支！',
            choices: toPromptsChoice(branchCache.merged)
        });
        branchCache.readyDelete = value;
    }
}
async function confirmOpenUrl() {
    const {
        value
    } = await prompts({
        type: 'toggle',
        name: 'value',
        message: '选择是否要自动打开search网页?',
        active: 'Yes',
        inactive: 'No'
    });
    isOpenUrl = value;
}

// 确定删除
async function confirmDeleteBranches() {
    const msgArr = branchCache.readyDelete.map((item) => {
        const url = `http://${searchUrl}/-/branches/all?search=${item}`;
        // 避免打开网页过多
        if (isOpenUrl && branchCache.readyDelete.length <= 10) {
            open(url);
        }
        return `${chalk.magenta(item)}: ${url}`;
    });
    const {
        value
    } = await prompts({
        type: 'toggle',
        name: 'value',
        message: `是否要删除这些分支?\n${msgArr.join('\n')}\n`,
        active: 'YES',
        inactive: 'NO'
    });
    return value;
}

async function getLocalBranches() {
    const item = await simpleGit.branchLocal();
    branchCache.current = item.current;
    branchCache.local = item.branches;
}


// 切换分支
async function co(branchName = 'develop') {
    await simpleGit.checkout(branchName);
}

// 根据branchAlias，获取远程已合并分支
async function getMergedBranches() {
    const branches = await simpleGit.raw(['branch', '-r', '--merged']);
    // 远程分支是以origin/开头,
    const reg = new RegExp(`(?<=origin\\/).*(${config.branchAlias.join('|')}).*`, 'g');
    branchCache.merged = branches.match(reg);
}

// 工具函数
// 将数据转换为多选 choice形式
function toPromptsChoice(arr) {
    return arr.map((item) => ({
        title: item,
        value: item,
    }))
}