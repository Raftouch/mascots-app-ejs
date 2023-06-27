const express = require('express')
const Mascot = require('../models/mascot')
const Collaborator = require('../models/collaborator')
const { ensureAuthenticated } = require('../config/auth')
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
router.get('/', ensureAuthenticated, async (req, res) => {
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
      layout: '../views/layouts/main' 
    })
  } catch (error) {
    res.redirect('/')
  }
})

// get a form for creating new mascot
router.get('/new', ensureAuthenticated, async (req, res) => {
  renderNewPage(res, new Mascot())
})

// create new mascot
router.post('/', ensureAuthenticated, upload.single('image'), async (req, res) => {
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
    res.redirect(`mascots/${newMascot.id}`)
  } catch (error) {
    // so that we don't upload a pic if there is an error
    if (mascot.imageName != null) {
      removeImage(mascot.imageName)
    }
    renderNewPage(res, mascot, true)
  }
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const mascot = await Mascot.findById(req.params.id)
      .populate('collaborator')
      .exec()
    res.render('mascots/show', { 
      mascot: mascot,
      layout: '../views/layouts/main' 
    
    })
  } catch (error) {
    res.redirect('/dashboard')
  }
})

router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const mascot = await Mascot.findById(req.params.id)
    renderEditPage(res, mascot)
  } catch (error) {
    res.redirect('/dashboard')
  }
})

router.put('/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null

  let mascot
  try {
    mascot = await Mascot.findById(req.params.id)
    mascot.name = req.body.name,
    mascot.collaborator = req.body.collaborator,
    mascot.breed = req.body.breed,
    mascot.gender = req.body.gender,
    mascot.birthDate = new Date(req.body.birthDate),
    mascot.imageName = fileName,
    mascot.description = req.body.description

    await mascot.save()
    res.redirect(`/mascots/${mascot.id}`)
  } catch (error) {
    if (mascot != null) {
      renderEditPage(res, mascot, true)
    } else {
      res.redirect('/dashboard')
    }
  }
})

router.delete('/:id', ensureAuthenticated, async (req, res) => {
  let mascot
  try {
    mascot = await Mascot.findByIdAndRemove(req.params.id)
    res.redirect('/mascots')
  } catch (error) {
    if (mascot != null) {
      res.render('mascots/show'), {
        mascot: mascot,
        errorMessage: 'Could not delete mascot',
        layout: '../views/layouts/main' 
      }
    } else {
      res.redirect('/dashboard')
    }
  }
})

async function renderNewPage(res, mascot, hasError = false) {
  renderFormPage(res, mascot, 'new', hasError )
}

async function renderEditPage(res, mascot, hasError = false) {
  renderFormPage(res, mascot, 'edit', hasError )
}

async function renderFormPage(res, mascot, form, hasError = false) {
  try {
    const collaborators = await Collaborator.find({})
    const params = {
      collaborators: collaborators,
      mascot: mascot,
      layout: '../views/layouts/main' 
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error updating Mascot'
      } else {
        params.errorMessage = 'Error creating Mascot'
      }
    }
    res.render(`mascots/${form}`, params)
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
