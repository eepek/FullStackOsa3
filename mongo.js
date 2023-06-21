const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fsouser:${password}@fullstackopen.m17b8tx.mongodb.net/Contacts?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  // id: Number,
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', noteSchema)

if (!process.argv[3]) {
  Contact.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
  mongoose.connection.close()
  })
} else {
  const contactName = process.argv[3]
  const contactNumber = process.argv[4]

  const contact = new Contact({
    name: contactName,
    number: contactNumber,
  })

  contact.save().then(result => {
    console.log(`added ${contactName} number ${contactNumber} to phonebook`)
  mongoose.connection.close()
})
}



