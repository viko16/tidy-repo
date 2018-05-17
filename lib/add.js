const { URL } = require('url')
const path = require('path')

const fs = require('fs-extra')
const giturl = require('giturl')
const execa = require('execa')
const chalk = require('chalk')
const clipboardy = require('clipboardy')
const debug = require('debug')('repo:add')
const runApplescript = require('run-applescript')

const { trigger } = require('./event')
const { getConfig } = require('./config')
const { expandHomeDir, logger } = require('./utils')

async function addRepo (cloneUrl) {
  const targetPath = await url2dir(cloneUrl)

  if (await fs.pathExists(targetPath)) {
    logger.error(chalk.underline.bold(targetPath), 'already exists.')
    await cd(targetPath)

    return
  }

  await trigger('preadd', { env: { targetPath, cloneUrl } })

  try {
    logger.info(`Ready to clone ${chalk.green.underline(cloneUrl)} into ${chalk.green.underline(targetPath)}`)
    const rst = await execa.shell(`git clone ${cloneUrl} ${targetPath}`, { stdio: 'inherit' })
    debug(rst)
    logger.info('Done!')
  } catch (error) {
    debug(error)
    logger.error('Git clone fail, reason: ', error.message || '')
    return
  }

  await trigger('postadd', { env: { targetPath, cloneUrl } })

  await cd(targetPath)
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

async function cd (targetPath) {
  const code = `
tell application "iTerm"
  tell current session of current window
    activate
    write text "cd ${targetPath}"
  end tell
end tell
  `
  if (process.platform === 'darwin') {
    await runApplescript(code)
  } else {
    try {
      await clipboardy.write(`cd ${targetPath}`)
      logger.info('Copied to clipboard:', chalk.magenta(`cd ${targetPath}`))
    } catch (error) {
      logger.error('Copy Failed.')
    }
  }
}

module.exports = {
  addRepo
}
