const bodyParser = require('body-parser')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())


//app.use(morgan('tiny'))
morgan.token('body', (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body)
  }
  else {
    return ""
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arthas Menethil", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Tirion Fordring", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Varian Wrynn", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Jaina Proudmoore", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  }
  else {
    response.sendStatus(404)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id != id)
  response.sendStatus(204)
})

app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const updated_person = request.body
  persons = persons.map(p => p.id === id ? updated_person : p )
  response.sendStatus(200)
})

app.post('/api/persons', (request, response) => {
  const MAX_ID = 1000000
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing!'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ 
      error: `The name "${body.name}" is already present in the phone book!`
    })
  }

  const new_person = {
    id: getRandomInt(MAX_ID).toString(),
    name: body.name,
    number: body.number
  }

  persons.push(new_person)
  response.json(new_person)
})


app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

