const express = require('express')
const app = express()
const morgan = require('morgan')
const db = require('./database')
const fs = require('fs')

// Make express use its own built-in body parser
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Require minimist module
const args = require('minimist')(process.argv.slice(2))
const port = args.port || process.env.PORT || 5555


const server = app.listen(port, () => {
    console.log('App is runnin on %port%'.replace('%port%', port))
})

app.use((req, res, next) => {
    let userlogindata = {
      email: req.email,
      password: req.password
    }
  
    const stmt = logdb.prepare('INSERT INTO userlog (email, password) VALUES (?, ?)')
    const info = stmt.run(userlogindata.email, userlogindata.password)
    
    next()
  })

  app.use((req, res, next) => {
    let wellnessdata = {
      wellness_rating: req.wellness_rating,
    }
  
    const stmt = logdb.prepare('INSERT INTO wellnesslog (wellness_rating) VALUES (?)')
    const info = stmt.run(wellnessdata.wellness_rating)
    
    next()
  })

