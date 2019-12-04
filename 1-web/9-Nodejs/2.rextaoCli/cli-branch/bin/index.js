#! /usr/bin/env node
const prompts = require('prompts');
const chalk = require('chalk');
const open = require('open');


const config = {
    workSpace: process.cwd(), //process.cwd(), // 获取node命令启动路径，其值与代码所在位置无关
    branchAlias: ['wt-','wangtao-']
};

let searchUrl = '' ; // 类似于：xxxxxxxadmin/-/branches/all?utf8=✓&search=wt-  地址
let isOpenUrl = false;
const simpleGit = require('simple-git/promise')(config.workSpace);

const branchCache = {
    current: '',
    local: {},
    merged: [], // 远程远程仓库已经merged分支，即通过--merged获取
    readyDelete: [], // 准备删除的，用户选择的，或全部删除的列表
};


(async function init(){
    await getLocalBranches(); // 要先获取本地分支，再切换到develop，最后再切换回当前分支
    await getSearchUrl();    // 可能是不同项目，search地址不同
    await developPull();     // 不拉最新的develop代码，不能准确获取已合并分支
    try {
        await getMergedBranches();  // 获取merged分支
        await confirmModeSelect();  // 选择删除模式
        await confirmOpenUrl();     // 选择是否打开网页，确定分支已经合并，避免误删
        await deleteBranch();       // 删除分支
    }catch (e) {
        console.log(chalk.red(e));
    }finally {
        await co(branchCache.current);
    }
})();

async function deleteBranch() {
    const { readyDelete, local } = branchCache;
    const localBranch = Object.keys(local);
    for (let i = 0; i < readyDelete.length; i++) {
        const item = readyDelete[i];
        // 只有在本地分支里面的分支进行删除
        if(localBranch.includes(item)) {
            const isDelete = await confirmDeleteBranches(item);  // 确定删除远程分支
            // 如确定要删除
            if(isDelete) {
                await deleteRemoteTracking(item);  // 确定删除本地分支
                await confirmDeleteLocalBranch(item);
            } else {
                console.log(chalk.green(`${item}并未删除`));
            }
        }
    }
}

// 删除远程分支tracking
async function deleteRemoteTracking(item){
    try {
        await simpleGit.raw(['branch','-r','-d',`origin/${item}`]);
        await simpleGit.push('origin', `:${item}`);
        console.log(chalk.green(`${item}远程分支删除成功`));
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
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
// 是否删除本地分支
async function confirmDeleteLocalBranch(item){
    const { value } = await prompts({
        type: 'toggle',
        name: 'value',
        message: '是否删除本地分支?',
        active: 'Yes',
        inactive: 'No'
    });
    if(value){
        try {
            await simpleGit.deleteLocalBranch(item);
            console.log(chalk.green(`本地分支删除成功`));
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
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
        branchCache.readyDelete = branchCache.merged;
    } else {//选择删除
        const { value } = await prompts({
            type: 'multiselect',
            name: 'value',
            message: '选择要删除的分支！',
            choices: toPromptsChoice(branchCache.merged)
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
    isOpenUrl = value;
}

// 确定删除
async function confirmDeleteBranches(item) {
    const url = `http://${searchUrl}/-/branches/all?search=${item}`;
    if(isOpenUrl){
        open(url);
    }
    const msgArr = `${chalk.magenta(item)}: ${url}`;
    const { value } = await prompts({
        type: 'toggle',
        name: 'value',
        message: `是否要删除这些分支?\n${msgArr}`,
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
async function co(branchName) {
    await simpleGit.checkout(branchName);
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

// 工具函数
// 将数据转换为多选 choice形式
function toPromptsChoice(arr) {
    return arr.map((item) => ({
        title: item,
        value: item,
    }))
}