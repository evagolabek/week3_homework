const Router = require('express').Router
const Event = require('./model')
const Sequelize = require('sequelize')

const router = new Router()
const Op = Sequelize.Op

router.get('/events/:id', (request, response) => {
  const eventId = request.params.id
  Event.findById(eventId).then(event => {
    response.send(event)
  })
})

router.get('/events', (request, response) => {
  Event.findAll({
    attributes: ['title', 'start_date', 'end_date'],
    where: { start_date: { [Op.gte]: Date.now() }
    }})
    .then(events => {
      response.send({ events })
  })
})

router.post('/events', (request, response) => {
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

router.put('/events/:id', (request, response) => {
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


router.delete('/events/:id', (request, response) => {
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

module.exports = router
