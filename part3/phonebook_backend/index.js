const express = require('express')
const app = express()


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
let lastApiCall = null

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    lastApiCall = new Date()
    const id = Number(request.params.id)
    const person = persons.find(rec => rec.id === id)
    if(!person){
        response.status(404).end()
    } else {
        response.json(person)
    }
})

app.get('/info', (request, response) => {
    lastApiCall = new Date()
    const countData = `Phonebook has info for ${persons.length} people`
    const html = `<p>${countData}</p></br><p>${lastApiCall}</p>`
    response.send(html)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(rec => rec.id !== id)
    response.status(204).send()
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})