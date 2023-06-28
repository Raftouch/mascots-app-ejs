const express = require('express')
const Mascot = require('../models/mascot')
const { ensureAuthenticated } = require('../config/auth')
const router = express.Router()
const path = require('path')
const uploadPath = path.join('public', Mascot.imageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const multer = require('multer')
const {
  getAll,
  createOne,
  getNew,
  getOne,
  editOne,
  updateOne,
  deleteOne,
} = require('../controllers/mascots')
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  },
})

// get all mascots
router.get('/', ensureAuthenticated, getAll)

// get a form for creating new mascot
router.get('/new', ensureAuthenticated, getNew)

// create new mascot
router.post('/', ensureAuthenticated, upload.single('image'), createOne)

// get one
router.get('/:id', ensureAuthenticated, getOne)

// edit one
router.get('/:id/edit', ensureAuthenticated, editOne)

// update one
router.put('/:id', ensureAuthenticated, upload.single('image'), updateOne)

// delete one
router.delete('/:id', ensureAuthenticated, deleteOne)

module.exports = router
