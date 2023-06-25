const express = require('express')
const Collaborator = require('../models/collaborator')
const Mascot = require('../models/mascot')
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
    res.redirect('/dashboard')
  }
})

// get a form for creating new collaborator
router.get('/new', (req, res) => {
  res.render('collaborators/new', { collaborator: new Collaborator() })
})

// create new collaborator
router.post('/', async (req, res) => {
  const collaborator = new Collaborator({ name: req.body.name })
  try {
    const newCollaborator = await collaborator.save()
    res.redirect(`collaborators/${newCollaborator.id}`)
  } catch (error) {
    res.render('collaborators/new', {
      collaborator: collaborator,
      errorMessage: 'Error creating Collaborator',
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id)
    const mascots = await Mascot.find({ collaborator: collaborator.id }).limit(5).exec()
    res.render('collaborators/show', {
      collaborator: collaborator,
      mascotsByCollaborator: mascots,
    })
  } catch (error) {
    res.redirect('/dashboard')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id)
    res.render('collaborators/edit', { collaborator: collaborator })
  } catch (error) {
    res.redirect('/collaborators')
  }
})

router.put('/:id', async (req, res) => {
  let collaborator
  try {
    collaborator = await Collaborator.findById(req.params.id)
    collaborator.name = req.body.name
    await collaborator.save()
    res.redirect(`/collaborators/${collaborator.id}`)
  } catch (error) {
    if (collaborator == null) {
      res.redirect('/dashboard')
    } else {
      res.render('collaborators/edit', {
        collaborator: collaborator,
        errorMessage: 'Error updating Collaborator',
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let collaborator
  try {
    const collaborator = await Collaborator.findById(req.params.id)
    const mascots = await Mascot.find({ collaborator: collaborator.id })
    mascots.length > 0 ? res.render('collaborators/show', {
      collaborator: collaborator,
      mascotsByCollaborator: mascots, 
      errorMessage: 'This collaborator has mascots still'
    }) : (await collaborator.deleteOne() && res.redirect('/collaborators'))
  } catch (error) {
    if (collaborator == null) {
      res.redirect('/dashboard')
    } else {
      res.redirect(`/collaborators/${collaborator.id}`)
    }
  }
})

module.exports = router
