const { getReposList, getTagsList } = require('./http');
const ora = require('ora');
const inquirer = require('inquirer');
const downloadGitRepo = require('download-git-repo');
const util = require('util');
const path = require('path')


// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();
  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    // 状态为修改为失败
    spinner.fail('Request failed, refetch ...');
  }
}

class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo() {
    const repoList = await wrapLoading(getReposList, 'fetching  template');
    if (!repoList) return;
    const repos = repoList.map((item) => item.name);
    const { repository } = await inquirer.prompt({
      name: 'repository',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project',
    });

    return repository;
  }

  async getTag(repo) {
    const tagsList = await wrapLoading(getTagsList, 'fetching  template',repo);
    if (!tagsList) return;
    const tags = tagsList.map((item) => item.name);
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: 'Please choose a template to create project',
    });
    return tag;
  }

  async createTemplates() {
    const repo = await this.getRepo();
    const tag = await this.getTag(repo);
    
    await this.downLoadTemplate(repo,tag);
  }


  async downLoadTemplate(repo,tag){
    const requestUrl = `github:zhurong-cli/${repo}${tag?'#'+tag:''}`;
    console.log('requestUrl',requestUrl);

    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir)), // 参数2: 创建位
      { clone: true }
  }






}

module.exports = Generator;
