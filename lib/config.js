const path = require('path')
const fs = require('fs-extra')

/**
 * Example Config
{
  "hostMap": {
    "github.com": "~/Code/github",
    "gitlab.com": "~/Code/gitlab"
  }
}
 */

const configDir = path.resolve(process.env.HOME, '.tidy-repo')
const configPath = path.resolve(configDir, 'config.json')

const defaults = { hostMap: {} }

async function initConfig () {
  await fs.ensureDir(configDir)
  if (await fs.pathExists(configPath)) {
    console.log('cofnig exist')
    return
  }

  await fs.writeJson(configPath, defaults, { spaces: 2 })
  console.log('Finish init')
}

async function getConfig (key) {
  if (!await fs.pathExists(configPath)) {
    await initConfig()
  }
  try {
    const config = await fs.readJson(configPath)
    return key ? config[key] : config
  } catch (error) {
    return ''
  }
}

async function setConfig (key, value) {
  if (!key) return
  try {
    const config = await getConfig()
    config[key] = value
    await fs.writeJson(configPath, config, { spaces: 2 })
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  initConfig,
  getConfig,
  setConfig
}
