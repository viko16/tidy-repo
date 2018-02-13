const { URL } = require('url')
const path = require('path')

const fs = require('fs-extra')
const giturl = require('giturl')
const execa = require('execa')
const chalk = require('chalk')
const debug = require('debug')('repo:add')

const { trigger } = require('./event')
const { getConfig } = require('./config')
const { expandHomeDir, logger } = require('./utils')

async function addRepo (url) {
  await trigger('preadd')

  const targetPath = await url2dir(url)

  if (await fs.pathExists(targetPath)) {
    logger.error(chalk.underline.bold(targetPath), 'already exists. Skipped!')
    return
  }

  logger.info(`Ready to clone ${chalk.green.underline(url)} into ${chalk.green.underline(targetPath)}`)
  try {
    const rst = await execa.shell(`git clone ${url} ${targetPath}`)
    debug(rst)
    logger.info('Done!')
  } catch (error) {
    debug(error)
    logger.error('Git clone fail, reason: ', error.message || '')
  }

  await trigger('postadd')
}

async function url2dir (url) {
  const hostMap = await getConfig('hostMap')
  url = giturl.parse(url)
  const { host, pathname } = new URL(url)
  const matchPath = expandHomeDir(hostMap[host])
  if (!matchPath) {
    // TODO: 交互式提示
    throw new Error('配置里没有 host 对应的路径')
  }
  return path.join(matchPath, pathname)
}

module.exports = {
  addRepo
}
