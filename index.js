
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let contacts = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }

]

morgan.token('contact', function (req, res) {
    const name = req.body.name
    const number = req.body.number
    if (req.method === 'POST') {
        return JSON.stringify({'name': name, 'number': number})
    } else {
        return ""
    }
})

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', morgan('tiny'), (req, resp) => {
    resp.json(contacts)
})

app.get('/info', morgan('tiny'), (req, resp) => {
    resp.send(`Phonebook has info for ${contacts.length} people<br>
    ${new Date()}`)
})

app.get('/api/persons/:id', morgan('tiny'), (req, respo) => {
    const id = Number(req.params.id)

    const contact = contacts.find(person => person.id === id)


    if (contact) {
        respo.json(contact)
    } else {
        respo.status(404).end()
    }
})

app.post('/api/persons/', morgan(':method :url :status :res[content-length] - :response-time ms :contact'), (req, resp) => {
    const contact = {"id": undefined, "name": req.body.name, "number": req.body.number}
    
    if (contacts.find(person => person.name === contact.name)) {
        return resp.status(400).json( {
            error: "Name must be unique!"
        })
    }

    if (!contact.name || !contact.number) {
        return resp.status(400).json( {
            error: "Contact must include name and number!"
        })
    }

    contact.id = Math.floor(Math.random() * 1000000)
    contacts.push(contact)
    // console.log(contacts)
    resp.json(contact)
})

app.delete('/api/persons/:id', morgan('tiny'), (req,resp) => {
    const id = Number(req.params.id)
    contacts = contacts.filter(person => person.id !== id)

    resp.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})