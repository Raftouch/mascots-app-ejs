const Collaborator = require('../models/collaborator')
const Mascot = require('../models/mascot')

// get all collaborators
const getAll = async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const collaborators = await Collaborator.find(searchOptions)
    res.render('collaborators/index', {
      collaborators: collaborators,
      searchOptions: req.query,
      layout: '../views/layouts/main',
    })
  } catch (error) {
    res.redirect('/dashboard')
  }
}

// get a form for creating new collaborator
const getNew = (req, res) => {
  res.render('collaborators/new', {
    collaborator: new Collaborator(),
    layout: '../views/layouts/main',
  })
}

// create new collaborator
const createOne = async (req, res) => {
  const collaborator = new Collaborator({ name: req.body.name })
  try {
    const newCollaborator = await collaborator.save()
    res.redirect(`collaborators/${newCollaborator.id}`)
  } catch (error) {
    res.render('collaborators/new', {
      collaborator: collaborator,
      errorMessage: 'Error creating Collaborator',
      layout: '../views/layouts/main',
    })
  }
}

// get one collaborator by id
const getOne = async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id)
    const mascots = await Mascot.find({ collaborator: collaborator.id })
      .limit(5)
      .exec()
    res.render('collaborators/show', {
      collaborator: collaborator,
      mascotsByCollaborator: mascots,
      layout: '../views/layouts/main',
    })
  } catch (error) {
    res.redirect('/dashboard')
  }
}

// edit one
const editOne = async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id)
    res.render('collaborators/edit', {
      collaborator: collaborator,
      layout: '../views/layouts/main',
    })
  } catch (error) {
    res.redirect('/collaborators')
  }
}

// update one
const updateOne = async (req, res) => {
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
        layout: '../views/layouts/main',
      })
    }
  }
}

//delete one
const deleteOne = async (req, res) => {
  let collaborator
  try {
    const collaborator = await Collaborator.findById(req.params.id)
    const mascots = await Mascot.find({ collaborator: collaborator.id })
    mascots.length > 0
      ? res.render('collaborators/show', {
          collaborator: collaborator,
          mascotsByCollaborator: mascots,
          errorMessage: 'This collaborator has mascots still',
          layout: '../views/layouts/main',
        })
      : (await collaborator.deleteOne()) && res.redirect('/collaborators')
  } catch (error) {
    if (collaborator == null) {
      res.redirect('/dashboard')
    } else {
      res.redirect(`/collaborators/${collaborator.id}`)
    }
  }
}

module.exports = {
  getAll,
  getNew,
  createOne,
  getOne,
  editOne,
  updateOne,
  deleteOne,
}
