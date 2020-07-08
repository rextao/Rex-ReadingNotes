#! /usr/bin/env node
const prompts = require('prompts');
const chalk = require('chalk');
const open = require('open');


const config = {
    workSpace: process.cwd(), //process.cwd(), // 获取node命令启动路径，其值与代码所在位置无关
    branchAlias: ['wt-','wangtao-']
};

let searchUrl = '' ; // 类似于：xxxxxxxadmin/-/branches/all?utf8=✓&search=wt-  地址
const simpleGit = require('simple-git/promise')(config.workSpace);

const branchCache = {
    current: '',
    local: {},
    merged: [], // 远程远程仓库已经merged分支，即通过--merged获取
    readyDelete: [], // 准备删除的，用户选择的，或全部删除的列表
    localMerged: [], // 本地且merged分支名
    res: [], // merged = localMerged + res;
};


(async function init(){
    await getLocalBranches(); // 要先获取本地分支，再切换到develop，最后再切换回当前分支
    await getSearchUrl();    // 可能是不同项目，search地址不同
    await developPull();     // 不拉最新的develop代码，不能准确获取已合并分支
    try {
        await getMergedBranches();  // 获取merged分支
        getMergedAndLocal(); // 获取merged并且是本地的分支（避免删除非本地分支）
        await confirmOpenUrl();     // 选择是否打开网页
        await confirmModeSelect();  // 选择删除模式
        await deleteBranch();       // 删除分支
    }catch (e) {
        console.log(chalk.red(e));
    }finally {
        await co(branchCache.current);
        console.log(chalk.green('*******远程merged，但本地不存在的branch********'));
        console.log(branchCache.res)
    }
})();

async function getLocalBranches() {
    const item = await simpleGit.branchLocal();
    branchCache.current = item.current;
    branchCache.local = item.branches;
}

// 获取branch查询地址，查看当前分支是否已经合并到develop，避免删错
async function getSearchUrl(){
    const remotes = await simpleGit.getRemotes(true);
    const { refs } = remotes.filter(item => item.name === 'origin')[0];
    // 通过refs中的fetch参数，获取searchUrl的域名
    const matches = refs.fetch.match(/git@(.*)\.git/);
    if(!matches) {
        throw new Error('fetch地址有误，无法获取branch的查询地址！可能是当前git参考非公司仓库');
    }
    searchUrl =  matches && matches[1].replace(':','/');
}

// 拉取develop分支最新内容
async function developPull(){
    await coMaster(); // 切换到develop分支
    await simpleGit.pull();
}

async function coMaster(){
    try {
        await co('develop') ;// 先切换到develop，如果不存在
    } catch (e) {
        try {
            console.log('error: pathspec \'develop\'已被catch');
            await co('master') ;// 再切换master
        }catch (e) {
            // Todo 理论上，如果不是这两分支，需要用户输入-。-，但一般主分支都是这俩
            throw new Error('此项目主分支不是master或develop，目前不支持-。-')
        }
    }
}
// 切换分支
async function co(branchName) {
    await simpleGit.checkout(branchName);
}

// 根据branchAlias，获取远程已合并分支
async function getMergedBranches() {
    const branches = await simpleGit.raw(['branch','-r','--merged']);
    // 远程分支是以origin/开头,
    const reg = new RegExp(`(?<=origin\\/).*(${config.branchAlias.join('|')}).*`, 'g');
    branchCache.merged = branches.match(reg);
    if(!branchCache.merged) {
        throw new Error('远程无已合并分支')
    }
}

// 获取merged并且是本地的分支（避免删除非本地分支）
function getMergedAndLocal() {
    const { merged, local } = branchCache;
    const localBranchKeys = Object.keys(local);
    localBranchKeys.forEach(item => {
        if(merged.includes(item)) {
            branchCache.localMerged.push(item)
        } else {
            branchCache.res.push(item)
        }
    });
    if (branchCache.localMerged.length === 0) {
        throw new Error('暂无需要删除是分支！');
    }
}


async function deleteBranch() {
    const readyDelete = branchCache.readyDelete;
    for (let i = 0; i < readyDelete.length; i++) {
        const item = readyDelete[i];
        const isDeleteRemote = await deleteRemoteTracking(item);
        if (isDeleteRemote) {
            await confirmDeleteLocalBranch(item);
        }
    }
}

// 删除远程分支tracking
async function deleteRemoteTracking(item){
    try {
        await simpleGit.raw(['branch','-r','-d',`origin/${item}`]);
        await simpleGit.push('origin', `:${item}`);
        console.log(chalk.green(`${item}远程分支删除成功`));
        return true;
    } catch (e) {
        console.log(`${item}远程分支不存在`);
        return false;
    }
}



// 删除本地分支
async function confirmDeleteLocalBranch(item){
    try {
        await simpleGit.deleteLocalBranch(item);
        console.log(chalk.green(`本地分支删除成功`));
    } catch (e) {
        console.log(e);
    }
}
// 删除模式选择
async function confirmModeSelect() {
    const { value } = await prompts({
        type: 'toggle',
        name: 'value',
        message: '选择删除分支模式?',
        active: '删除全部',
        inactive: '选择删除'
    });
    // 选择全部删除时
    if (value) {
        branchCache.readyDelete = branchCache.localMerged;
    } else {//选择删除
        const { value } = await prompts({
            type: 'multiselect',
            name: 'value',
            message: '选择要删除的分支！',
            choices: toPromptsChoice(branchCache.localMerged)
        });
        branchCache.readyDelete = value;
    }
}
async function confirmOpenUrl(){
    const { value } = await prompts({
        type: 'toggle',
        name: 'value',
        message: '选择是否要自动打开search网页?',
        active: 'Yes',
        inactive: 'No'
    });
    if(value){
        const localMerged = branchCache.localMerged;
        for (let i = 0; i < localMerged.length; i++) {
            const item = localMerged[i];
            const url = `http://${searchUrl}/-/branches/all?search=${item}`;
            open(url);
        }
    }
}



// 工具函数
// 将数据转换为多选 choice形式
function toPromptsChoice(arr) {
    return arr.map((item) => ({
        title: item,
        value: item,
    }))
}
