const path = require('path')

const fs = require('fs-extra')
const execa = require('execa')
const chalk = require('chalk')
const debug = require('debug')('repo:event')

const { logger } = require('./utils')
const { getConfig } = require('./config')
const lifeCycleDir = path.resolve(process.env.HOME, '.tidy-repo', 'lifeCycle')
const lifeCycleEvents = ['preadd', 'postadd', 'preimport', 'postimport']
const envPrefix = 'TIDY_REPO'

async function trigger (name, opts = {}) {
  fs.ensureDir(lifeCycleDir)

  const expectFile = path.resolve(lifeCycleDir, `${name}.js`)
  if (
    lifeCycleEvents.includes(name) &&
    await fs.exists(expectFile)
  ) {
    const prefix = chalk.green(`[repo:event:${name}]`)
    try {
      const options = { ...opts }
      options.env = await processEnv(options.env, name)
      const { stdout } = await execa.shell(`node ${expectFile}`, options)
      logger.info(prefix, 'Output:', stdout)
    } catch (error) {
      debug(error)
      logger.error(prefix, 'Error:', error.message || '')
    }
  }
}

async function processEnv (envObj = {}, eventName) {
  const formatedEnv = {}
  for (const key in envObj) {
    if (envObj.hasOwnProperty(key)) {
      const val = envObj[key]
      formatedEnv[`${envPrefix}_${key.toUpperCase()}`] = val
    }
  }
  const configs = await getConfig()
  formatedEnv[`${envPrefix}_CONFIG`] = JSON.stringify(configs)
  formatedEnv[`${envPrefix}_EVENTNAME`] = eventName
  return formatedEnv
}

module.exports = {
  trigger,
  lifeCycleEvents
}
