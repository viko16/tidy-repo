#!/usr/bin/env node

const sade = require('sade')

const prog = sade('repo')
const pkg = require('./package.json')
const { initConfig } = require('./lib/config')
const { addRepo } = require('./lib/add')
const { logger } = require('./lib/utils')

prog
  .version(pkg.version)

prog
  .command('init')
  .describe('Initial config files. (~/.tidy-repo/config.js)')
  .action(() => {
    initConfig().catch(logger.error)
  })

prog
  .command('add <url>')
  .describe('Add repository cleverly.')
  .example('add https://github.com/vuejs/vue.git')
  .example('add git@github.com:vuejs/vue.git')
  .action(url => {
    addRepo(url).catch(logger.error)
  })

prog
  .command('import <from>')
  .describe('Import repositories from existing directory.')
  .example('import ~/Code')
  .action(from => {
    console.log('run import', from)
  })

prog.parse(process.argv)
