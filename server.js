const express = require('express')
const app = express()
const morgan = require('morgan')
const db = require('./database')
const path = require('path')
//const fs = require('fs')
let initialPath = path.join(__dirname, "public");
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
  
    const stmt = db.prepare('INSERT INTO userlog (email, password) VALUES (?, ?)')
    const info = stmt.run(userlogindata.email, userlogindata.password)
    
    next()
  })

  app.use((req, res, next) => {
    let wellnessdata = {
      wellness_rating: req.wellness_rating,
    }
  
    const stmt = db.prepare('INSERT INTO wellnesslog (wellness_rating) VALUES (?)')
    const info = stmt.run(wellnessdata.wellness_rating)
    
    next()
  })


  app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(initialPath, "register.html"));
})

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        db("userlog").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('userlog')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect');
        }
    })
})



