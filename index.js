const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.json())

var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://localhost:5432/postgres')
const Op = Sequelize.Op

app.listen(4001, () => console.log('Express API listening on port 4001'))


var Event = sequelize.define('event', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  start_date: Sequelize.DATE,
  end_date: Sequelize.DATE
}, {
  tableName: 'events',
  timestamps: false  //tells sequelize not to look for 'created/updated at' fields
})

app.get('/events/:id', (request, response) => {
  const eventId = request.params.id
  Event.findById(eventId).then(event => {
    response.send(event)
  })
})

app.get('/events', (request, response) => {
  Event.findAll({
    attributes: ['title', 'start_date', 'end_date'],
    where: { start_date: { [Op.gte]: Date.now() }
    }})
    .then(events => {
      response.send({ events })
  })
})

app.post('/events', (request, response) => {
  const event = request.body

  // couldn't compare with Date.now()
  if(event.start_date > event.end_date) {
    response.send('start_date must be before the end date')
  }
  else {
    Event.create(event).then(event => {
      response.status(201).send(event)
    })
  }
})

app.put('/events/:id', (request, response) => {
  const eventId = Number(request.params.id)
  const updates = request.body

  Event.findById(request.params.id)
    .then(event => {
      return event.update(updates)
    })
    .then(event => {
      response.send('the event has been updated')
    })
    .catch(error => {
      response.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
})


app.delete('/events/:id', (request, response) => {
  const eventId = Number(request.params.id)

 Event.findById(request.params.id)
    .then(event => {
      return event.destroy()
    })
    .then(_ => {
      response.send({
        message: 'The event was deleted succesfully'
      })
    })
    .catch(error => {
      response.status(500).send({
        message: `Something went wrong`,
        error
      })
    })

})
