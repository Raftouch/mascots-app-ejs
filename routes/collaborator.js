const express = require('express')
const Collaborator = require('../models/collaborator')
const router = express.Router()

// get all collaborators
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const collaborators = await Collaborator.find(searchOptions)
    res.render('collaborators/index', {
      collaborators: collaborators,
      searchOptions: req.query,
    })
  } catch (error) {
    res.redirect('/')
  }
})

// get a form for creating new collaborator
router.get('/new', (req, res) => {
  res.render('collaborators/new', {
    collaborator: new Collaborator(),
  })
})

// create new collaborator
router.post('/', async (req, res) => {
  const collaborator = new Collaborator({
    name: req.body.name,
  })
  try {
    const newCollaborator = await collaborator.save()
    // res.redirect(`collaborators/${newCollaborator.id}`)
    res.redirect('collaborators')
  } catch (error) {
    res.render('collaborators/new', {
      collaborator: collaborator,
      errorMessage: 'Error creating Collaborator',
    })
    // console.log(error);
  }
})

module.exports = router
