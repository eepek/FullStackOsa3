
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')


const app = express()

// let contacts = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456"
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523"
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345"
//     },
//     {
//         id: 4,
//         name: "Mary Poppendick",
//         number: "39-23-6423122"
//     }

// ]

morgan.token('contact', function (req, res) {
    const name = req.body.name
    const number = req.body.number
    if (req.method === 'POST') {
        return JSON.stringify({'name': name, 'number': number})
    } else {
        return ""
    }
})

app.use(express.static('build'))
app.use(express.json())
app.use(cors())





app.get('/api/persons', morgan('tiny'), (req, resp) => {
    Contact.find({}).then(contact_info => {
        resp.json(contact_info)
    })
})

app.get('/info', morgan('tiny'), (req, resp) => {
    Contact.countDocuments()
        .then(count => {
            resp.send(`Phonebook has info for ${count} people<br>
            // ${new Date()}`)
        })
        .catch(error => next(error))
    })
    // resp.send(`Phonebook has info for ${contacts.length} people<br>
    // ${new Date()}`)


app.get('/api/persons/:id', morgan('tiny'), (req, resp, next) => {
    Contact.findById(req.params.id)
        .then(person => {
            if (person) {
                resp.json(person)
            } else {
                resp.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons/', morgan(':method :url :status :res[content-length] - :response-time ms :contact'), (req, resp,next) => {
    

    // if (!req.body.name || !req.body.number) {
    //     return resp.status(400).json( {
    //         error: "Contact must include name and number!"
    //     })
    // }

    const contact = new Contact({
        name: req.body.name, 
        number: req.body.number,
    })

    contact.save()
        .then(savedContact => {
            resp.json(savedContact)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', morgan('tiny'), (req, resp, next) => {
    const contact = {
        name: req.body.name,
        number: req.body.number
    }

    Contact.findByIdAndUpdate(req.params.id, contact, {new: true})
        .then(updatedContact => {
            resp.json(updatedContact)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', morgan('tiny'), (req,resp) => {
    Contact.findByIdAndDelete(req.params.id)
    .then(result => {
        resp.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, resp, next) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, resp, next) => {
    // console.log(error)

    if (error.name === 'CastError') {
        return resp.status(400).send({error: 'wrong id'})
    } else if (error.name === 'ValidationError') {
        return resp.status(400).json(error.message)
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})