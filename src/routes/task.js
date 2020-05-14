const express = require('express')

const checklistDependentRoute = express.Router()
const simpleRouter = express.Router()

const Checklist = require('../models/checklist')
const Task = require('../models/task')

checklistDependentRoute.get('/:id/tasks/new', async (request, response) => {
  try{
    let task = Task()
    response.status(200).render('tasks/new', { checklistId: request.params.id, task: task })
  } catch(error){
    response.status(422).render('pages/error', { errors: 'Erro ao carregar formulário' })
  }
})

simpleRouter.delete('/:id', async (request, response) => {
  try{
    let task = await Task.findByIdAndDelete(request.params.id)
    let checklist = await Checklist.findById(Task.checklist)
    let taskToRemove = checklist.tasks.indexOf(task._id)
    checklist.tasks.slice(taskToRemove, 1)
    checklist.save()
    response.redirect(`/checklist/${checklist._id}`)
  } catch(error){
    response.status(422).render('pages/error', { errors: 'Erro ao remover uma tarefa'  })

  }
})

checklistDependentRoute.post('/:id/tasks', async (request, response) => {
  let { name } = request.body.task
  let task = new Task({ name, checklist: request.params.id })

  try{
    await task.save()
    let checklist = await Checklist.findById(request.params.id)
    checklist.tasks.push(task)
    await checklist.save()
    response.redirect(`/checklists/${request.params.id}`)
  } catch(error){
    let errors = error.errors
    response.status(422).render('tasks/new', { task: {...task, errors}, checklistId: request.params.id })
  }
})

simpleRouter.put('/:id', async (request, response) => {
  let task = await Task.findById(request.params.id)
  try{
    task.set(request.body.task)
    await task.save()
    response.status(200).json({ task })
  } catch(error){
    let errors = error.errors
    response.status(422).json({ task: { ...errors } })
  }
})

module.exports = { checklistDependent: checklistDependentRoute, simple: simpleRouter }