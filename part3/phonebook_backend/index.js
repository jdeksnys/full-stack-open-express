require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.json())


morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : null);
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res)
    ].join(' ');
  })
);
  


let lastApiCall = null

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    lastApiCall = new Date()
    const id = Number(request.params.id)
    Person.find({id: id}).then(person => {
      response.json(person)
    })
})

app.get('/info', (request, response) => {
    lastApiCall = new Date()
    Person.find({}).then(persons => {
      const countData = `Phonebook has info for ${persons.length} people`
      const html = `<p>${countData}</p></br><p>${lastApiCall}</p>`
      response.send(html)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    Person.findOneAndDelete({id: id}).then(persons => {
      response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
    if(!request.body) {
        return response.status(400).json({error: "request body missing"})
    }
    const name = request.body.name
    const number = request.body.number
    if(!name || !number){
        return response.status(400).json({error: "name or number missing"})
    }
    
    Person.find({name: name}).then(persons => {
      if(persons.length > 0){
        return response.status(409).json({error: "name must be unique"})
      } else {
        const p = new Person({
          id: Math.floor(Math.random() * 1000000),
          name: request.body.name,
          number: request.body.number
        })
        p.save().then(savedPerson => {
          response.status(204).end()
        })
      }
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
    console.log(`Server running on ${process.env.MONGODB_URI}`)
})