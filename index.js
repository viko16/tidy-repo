#!/usr/bin/env node

const sade = require('sade')

const prog = sade('repo')
const pkg = require('./package.json')

prog
  .version(pkg.version)

prog
  .command('init')
  .describe('Initial config files. (~/.tidy-repo/config.js)')
  .action(() => {
    console.log('run init')
  })

prog
  .command('add <url>')
  .describe('Add repository cleverly.')
  .example('add https://github.com/vuejs/vue.git')
  .example('add git@github.com:vuejs/vue.git')
  .action(url => {
    console.log('run add', url)
  })

prog
  .command('import <from>')
  .describe('Import repositories from existing directory.')
  .example('import ~/Code')
  .action(from => {
    console.log('run import', from)
  })

prog.parse(process.argv)
