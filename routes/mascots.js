const express = require('express')
const Mascot = require('../models/mascot')
const Collaborator = require('../models/collaborator')
const router = express.Router()
const path = require('path')
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
  res.send('All mascots')
})

// get a form for creating new mascot
router.get('/new', async (req, res) => {
  renderNewPage(res, new Mascot())

  // try {
  //   const collaborators = await Collaborator.find({})
  //   const mascot = new Mascot()
  //   res.render('mascots/new', {
  //     collaborators: collaborators,
  //     mascot: mascot,
  //   })
  // } catch (error) {
  //   res.redirect('/mascots')
  // }
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

module.exports = router
