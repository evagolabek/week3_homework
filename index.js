const express = require('express')
const app = express()


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
    where: {
      start_date: {
        [Op.gte]: Date.now()
      }
    }})
    .then(events => {
    response.send({ events })
  })
})
