const express = require('express')

const router = express.Router()

const Checklist = require('../models/checklist')

router.get('/', async (request, response) => {
  try{
    let checklists = await Checklist.find({})
    response.status(200).render('checklists/index', { checklists: checklists })
  } catch(error){
    response.status(200).render('pages/error', { error: 'Erro ao exibir as Listas' })
  }
})

router.get('/new', async (request, response) => {
  try{
    let checklist = new Checklist()
    response.status(200).render('checklists/new', { checklist: checklist })
  } catch(error){
    response.status(500).render('pages/error', { error: 'Erro ao carregar o formulário' })
  }
})

router.get('/:id/edit', async (request, response) => {
  try{
    let checklist = await Checklist.findById(request.params.id)
    response.status(200).render('checklists/edit', { checklist: checklist })
  } catch(error){
    response.status(500).render('pages/error', { error: 'Erro ao exibir a edição Lista de tarefas'})
  }
})

router.post('/', async (request, response) => {
  let { name } = request.body.checklist
  let checklist = new Checklist({ name })
  
  try{
    await checklist.save()
    response.redirect('checklists')
  } catch(error){
    response.status(422).render('checklists/new', { checklists: { ...checklist, error } })
  }
})

router.get('/:id', async (request, response) => {
  try{
    let checklist = await Checklist.findById(request.params.id).populate('tasks')
    response.status(200).render('checklists/show', { checklist: checklist })
  } catch(error){
    response.status(500).render('pages/error', { error: 'Erro ao exibir as Listas de Tarefas' })
  }
})
router.put('/:id', async (request, response) => {
  let { name } = request.body.checklist
  let checklist = await Checklist.findById(request.params.id)
  try{
    await checklist.update({ name })
    response.redirect('/checklists')
  } catch(error){
    let errors = error.errors
    response.status(422).render('checklists/edit', {checklist: { ...checklist, errors }})
  }
})

router.delete('/:id', async (request, response) => {
  try{
    let checklist = await Checklist.findByIdAndRemove(request.params.id)
    response.redirect('/checklists')
  } catch(error){
    response.status(500).render('pages/error', { error: 'Erro ao deletar a Lista de Tarefas'})
  }
})

module.exports = router