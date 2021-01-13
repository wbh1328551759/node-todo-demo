#!/usr/bin/env node
const { program } = require('commander');
const api = require('./index.js')
const pkg = require('./package.json')

program
  .version(pkg.version)

program
  .command('add')
  .description('add a task')
  .action((task) => {
    let newTasks = task.args.join(' ')
    api.add(newTasks).then(() => {console.log('添加成功')}, () => {console.log('添加失败')})
  });

program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(() => console.log('清除完成'), () => console.log('清除失败'));
  });

program
  .command('show')
  .description('show all content in todo')
  .action(() => {
    api.showAll()
  });

program.parse(process.argv);

if(process.argv.length === 2){
  void api.showAll()
}

