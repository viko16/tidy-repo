const path = require('path')

const fs = require('fs-extra')
const execa = require('execa')

const lifeCycleDir = path.resolve(process.env.HOME, '.tidy-repo', 'lifeCycle')

const lifeCycleEvents = ['preadd', 'postadd', 'preimport', 'postimport']

async function trigger (name) {
  console.log('running hook', name)
  fs.ensureDir(lifeCycleDir)

  const expect = path.resolve(lifeCycleDir, `${name}.js`)
  if (
    lifeCycleEvents.includes(name) &&
    await fs.exists(expect)
  ) {
    const { stdout } = await execa.shell(`node ${expect}`)
    console.log(`[repo:event:${name}]`, stdout)
  }
}

module.exports = {
  trigger
}
