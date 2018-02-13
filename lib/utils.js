const path = require('path')
const chalk = require('chalk')

const homedir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']

function expandHomeDir (pathStr) {
  if (!pathStr) return pathStr
  if (pathStr === '~') return homedir
  if (pathStr.slice(0, 2) !== '~/') return pathStr
  return path.join(homedir, pathStr.slice(2))
}

const logger = {
  info (...args) {
    console.log(chalk.green('✔︎ '), ...args)
  },
  error (...args) {
    console.log(chalk.red('✘ ', ...args))
  }
}

module.exports = {
  expandHomeDir,
  logger
}
