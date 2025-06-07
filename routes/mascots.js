const express = require('express')
const Mascot = require('../models/mascot')
const router = express.Router()
const path = require('path')
const uploadPath = path.join('public', Mascot.imageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const { ensureAuthenticated } = require('../config/auth')
const {
  getAll,
  createOne,
  getNew,
  getOne,
  editOne,
  updateOne,
  deleteOne,
} = require('../controllers/mascots')
const multer = require('multer')
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  },
})

router.get('/', ensureAuthenticated, getAll)

router.get('/new', ensureAuthenticated, getNew)

router.post('/', ensureAuthenticated, upload.single('image'), createOne)

router.get('/:id', ensureAuthenticated, getOne)

router.get('/:id/edit', ensureAuthenticated, editOne)

router.put('/:id', ensureAuthenticated, upload.single('image'), updateOne)

router.delete('/:id', ensureAuthenticated, deleteOne)

module.exports = router
