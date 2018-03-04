const Sequelize = require('sequelize')
const sequelize = require('../db')

var Event = sequelize.define('event', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  start_date: Sequelize.DATE,
  end_date: Sequelize.DATE
}, {
  tableName: 'events',
  timestamps: false  //tells sequelize not to look for 'created/updated at' fields
})

module.exports = Event
