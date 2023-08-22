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

router.get('/', ensureAuthenticated, getAll)

router.get('/new', ensureAuthenticated, getNew)

router.post('/', ensureAuthenticated, createOne)

router.get('/:id', ensureAuthenticated, getOne)

router.get('/:id/edit', ensureAuthenticated, editOne)

router.put('/:id', ensureAuthenticated, updateOne)

router.delete('/:id', ensureAuthenticated, deleteOne)

module.exports = router
