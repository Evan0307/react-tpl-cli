
// 通过 axios 处理请求
const axios = require('axios');

axios.interceptors.response.use(res => {
  return res.data;
})

/**
 * 获取模板列表
 * @returns Promise
 */
async function getReposList() {
  return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}


/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function  getTagsList(repo) {
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
  getReposList,
  getTagsList
}
