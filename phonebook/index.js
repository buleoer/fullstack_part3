const bodyParser = require('body-parser')
const express = require('express')

const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

