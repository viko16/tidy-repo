const path = require('path')

const fs = require('fs-extra')
const execa = require('execa')
const chalk = require('chalk')
const debug = require('debug')('repo:event')

const { logger } = require('./utils')
const lifeCycleDir = path.resolve(process.env.HOME, '.tidy-repo', 'lifeCycle')
const lifeCycleEvents = ['preadd', 'postadd', 'preimport', 'postimport']

async function trigger (name) {
  fs.ensureDir(lifeCycleDir)

  const expectFile = path.resolve(lifeCycleDir, `${name}.js`)
  if (
    lifeCycleEvents.includes(name) &&
    await fs.exists(expectFile)
  ) {
    const prefix = chalk.green(`[repo:event:${name}]`)
    try {
      const { stdout } = await execa.shell(`node ${expectFile}`)
      logger.info(prefix, 'Output:', stdout)
    } catch (error) {
      debug(error)
      logger.error(prefix, 'Error:', error.message || '')
    }
  }
}

module.exports = {
  trigger
}
