// Load environment variables
require('dotenv').config()

// Import dependencies
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

// Initialize the app
const app = express()

// Middleware
app.use(express.json())
app.use(express.static('dist'))

// Custom morgan logging middleware
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body),
    ].join(' ')
  })
)

// Assign unique ID to each request
app.use((req, res, next) => {
  req.id = Date.now()
  next()
})

// Define custom morgan tokens
morgan.token('id', (req) => req.id)
morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body) || 'N/A'
  }
  return ''
})

// Routes

// Root route
app.get('/', (req, res) => {
  res.send('<h1>Phonebook Backend!</h1>')
})

// Get all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((error) => next(error))
})

// Get info about the phonebook
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(
        `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
      )
    })
    .catch((error) => next(error))
})

// Get a single person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// Add a new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number missing' })
  }

  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        return res.status(400).json({ error: 'Name must be unique' })
      }

      const person = new Person({ name, number })
      return person.save()
    })
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error))
})

// Update a person's phone number
app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body

  if (!number) {
    return res.status(400).json({ error: 'Number is missing' })
  }

  const updatedPerson = { number }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).json({ error: 'Person not found' })
      }
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

// Delete a person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Person not found' })
      }
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// Middleware for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
})

// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})