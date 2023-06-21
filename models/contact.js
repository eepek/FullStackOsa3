const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error conneccting to MongoDB:', error.message)
    })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: phonenumber => {
        return /^\d{2,3}-\d{5,}$/.test(phonenumber)
        // if (/\d{3}[-]\d{5,}/.test(phonenumber) || /\d{2}[-]\d{6,}/.test(phonenumber)) {
        //   return true
        // } else {
        //   return false
        // }
      }
    }

  },
})


contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Contact', contactSchema)