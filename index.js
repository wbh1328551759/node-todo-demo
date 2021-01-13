const db = require('./db')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  const list = await db.read()

  list.push({title: title, done: false})

  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}

function markAsUnDone(list, index) {
  list[index].done = false
  db.write(list)
}

function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '新的标题',
    default: list[index].title
  }).then(answer => {
    list[index].title = answer.title
    db.write(list)
  })
}

function remove(list, index) {
  list.splice(index, 1)
  db.write(list)
}

function askForAction(list, index) {
  const actions = {markAsDone, markAsUnDone, updateTitle, remove}
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: '请选择要执行的操作',
    choices: [
      {name: '退出', value: 'quit'},
      {name: '已完成', value: 'markAsDone'},
      {name: '未完成', value: 'markAsUnDone'},
      {name: '修改标题', value: 'updateTitle'},
      {name: '删除', value: 'remove'},
    ]
  }).then((answer2) => {
    const action = actions[answer2.action]
    action && action(list, index)
  })
}

function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '请输入新的标题',
  }).then(answer => {
    list.push({title: answer.title, done: false})
    db.write(list)
  })
}

async function printTasks(list) {
  inquirer.prompt(
      {
        type: 'list',
        name: 'index',
        message: '请选择你想操作的任务',
        choices: [
          ...list.map((task, index) => {
            return {name: `${task.done ? '[√]' : '[×]'}${index + 1}: ${task.title}`, value: index.toString()}
          }),
          {name: '创建新任务', value: '-2'},
          {name: '退出', value: '-1'}
        ]
      })
    .then((answer) => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForAction(list, index)
      } else if (index === -2) {
        askForCreateTask(list)
      }
    })
}

module.exports.showAll = async () => {
  const list = await db.read()

  printTasks(list)
}
