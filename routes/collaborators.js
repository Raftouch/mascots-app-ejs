const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const {
  getAll,
  getNew,
  createOne,
  getOne,
  editOne,
  updateOne,
  deleteOne,
} = require('../controllers/collaborators')

// get all collaborators
router.get('/', ensureAuthenticated, getAll)

// get a form for creating new collaborator
router.get('/new', ensureAuthenticated, getNew)

// create new collaborator
router.post('/', ensureAuthenticated, createOne)

// get one by id
router.get('/:id', ensureAuthenticated, getOne)

// edit one
router.get('/:id/edit', ensureAuthenticated, editOne)

// update one
router.put('/:id', ensureAuthenticated, updateOne)

// delete one
router.delete('/:id', ensureAuthenticated, deleteOne)

module.exports = router
