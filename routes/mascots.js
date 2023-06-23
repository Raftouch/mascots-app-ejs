const express = require('express')
const Mascot = require('../models/mascot')
const Collaborator = require('../models/collaborator')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Mascot.imageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const multer = require('multer')
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  },
})

// get all mascots
router.get('/', async (req, res) => {
  // to activate our search line
  let query = Mascot.find()
  if (req.query.name != null && req.query.name !== '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }
  if (req.query.bornBefore != null && req.query.bornBefore !== '') {
    query = query.lte('birthDate', req.query.bornBefore)
  }
  if (req.query.bornAfter != null && req.query.bornAfter !== '') {
    query = query.gte('birthDate', req.query.bornAfter)
  }
  try {
    const mascots = await query.exec()
    res.render('mascots/index', {
      mascots: mascots,
      searchOptions: req.query,
    })
  } catch (error) {
    res.redirect('/')
  }
})

// get a form for creating new mascot
router.get('/new', async (req, res) => {
  renderNewPage(res, new Mascot())
})

// create new mascot
router.post('/', upload.single('image'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const mascot = new Mascot({
    name: req.body.name,
    collaborator: req.body.collaborator,
    breed: req.body.breed,
    gender: req.body.gender,
    birthDate: new Date(req.body.birthDate),
    imageName: fileName,
    description: req.body.description,
  })
  try {
    const newMascot = await mascot.save()
    // res.redirect(`mascots/${newMascot.id}`)
    res.redirect('mascots')
  } catch (error) {
    // so that we don't upload a pic if there is an error
    if (mascot.imageName != null) {
      removeImage(mascot.imageName)
    }
    renderNewPage(res, mascot, true)
  }
})

async function renderNewPage(res, mascot, hasError = false) {
  try {
    const collaborators = await Collaborator.find({})
    const params = {
      collaborators: collaborators,
      mascot: mascot,
    }
    // const mascot = new Mascot()
    if (hasError) params.errorMessage = 'Error creating Mascot'
    res.render('mascots/new', params)
  } catch (error) {
    res.redirect('/mascots')
  }
}

function removeImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (error) => {
    if (error) console.log(error)
  })
}

module.exports = router
