const { model, Schema, Types } = require('mongoose')
const path = require('path')
const imageBasePath = 'uploads/mascotImages'

const mascotSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  imageName: {
    type: String,
    required: true,
  },
  collaborator: {
    type: Types.ObjectId,
    required: true,
    ref: 'Collaborator',
  },
})

// create virtual property for all mascots page
mascotSchema.virtual('imagePath').get(function () {
  if (this.imageName != null) {
    return path.join('/', imageBasePath, this.imageName)
  }
})

module.exports = model('Mascot', mascotSchema)
module.exports.imageBasePath = imageBasePath
