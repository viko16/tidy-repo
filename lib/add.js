const { URL } = require('url')
const path = require('path')

const fs = require('fs-extra')
const giturl = require('giturl')
const execa = require('execa')

const { trigger } = require('./event')
const { getConfig } = require('./config')

async function addRepo (url) {
  await trigger('preadd')

  const targetPath = await url2dir(url)

  if (await fs.pathExists(targetPath)) {
    console.log(targetPath, '已经存在')
    return
  }

  console.log(`准备克隆 ${url} 到 ${targetPath}`)
  await execa.shell(`git clone ${url} ${targetPath}`)

  await trigger('postadd')
}

async function url2dir (url) {
  const hostMap = await getConfig('hostMap')
  url = giturl.parse(url)
  const { host, pathname } = new URL(url)
  if (!hostMap[host]) {
    // TODO: 交互式提示
    throw new Error('配置里没有 host 对应的路径')
  }
  return path.join(hostMap[host], pathname)
}

module.exports = {
  addRepo
}
