const path = require('path')
const fs = require('fs-extra')

/**
 * Example Config
module.exports = {
  hostMap: {
    'github.com': '~/Code/github',
    'gitlab.com': '~/Code/gitlab'
  },
  lifeCycle: {
    preadd: function () {},
    postadd: function () {},
    preimport: function () {},
    postimport: function () {}
  }
}
 */

const configDir = path.resolve(process.env.HOME, '.tidy-repo')
const configPath = path.resolve(configDir, 'config.js')
const configTpl = `
module.exports = {
  hostMap: {
    'github.com': '~/Code/github',
    'gitlab.com': '~/Code/gitlab'
  },
  lifecycle: {
    preadd: function() {},
    postadd: function() {},
    preimport: function() {},
    postimport: function() {}
  }
}
`

async function initConfig () {
  await fs.ensureDir(configDir)
  if (await fs.pathExists(configPath)) {
    console.log('cofnig exist')
    return
  }

  await fs.writeFile(configPath, configTpl, 'utf-8')
  console.log('Finish init')
}

async function getConfig (key) {
  if (!key) return null
  if (!await fs.pathExists(configPath)) {
    await initConfig()
  }
  const config = require(configPath)
  return config[key]
}

module.exports = {
  initConfig,
  getConfig
}
