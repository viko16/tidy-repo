const { getConfig } = require('./config')

async function trigger (name) {
  console.log('running hook', name)
  const lifeCycle = await getConfig('lifeCycle')
  if (
    lifeCycle &&
    lifeCycle[name] &&
    typeof lifeCycle[name] === 'function'
  ) {
    await lifeCycle[name]()
  }
}

module.exports = {
  trigger
}
