const { model, Schema } = require('mongoose')

const collaboratorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
})

module.exports = model('Collaborator', collaboratorSchema)
