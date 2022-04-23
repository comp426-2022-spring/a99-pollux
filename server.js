const express = require('express')
const app = express()
const morgan = require('morgan')
const db = require('./database')
const path = require('path')

const insertStatement = db.prepare('INSERT INTO userlog (email, password) VALUES (?, ?)');

//const fs = require('fs')
let initialPath = path.join(__dirname, "public/");
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
      Name: req.Name,
      Email: req.Email,
      Password: req.Password
    }
  
    const stmt = db.prepare('INSERT INTO userlog (Name, Email, Password) VALUES (?, ?, ?)')
    const info = stmt.run(userlogindata.Name, userlogindata.Email, userlogindata.Password)
    
    next()
  })

  app.use((req, res, next) => {
    const d = new Date();
    let wellnessdata = {
      Wellness_rating: req.Wellness_rating,
      Day: d.getDate(),
      Month: d.getMonth(),
      Year: d.getYear()
    }
  
    const stmt = db.prepare('INSERT INTO wellnesslog (Wellness_rating, Day, Month, Year) VALUES (?, ?, ?, ?)')
    const info = stmt.run(wellnessdata.Wellness_rating, wellnessdata.Day, wellnessdata.Month, wellnessdata.Year)
    next()
  })


  app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

app.get("/app/users", (req,res) => {
    res.json({"message": "yay"});
    try {
        const stmt = db.prepare('SELECT * FROM userlog').all()
        res.status(200).json(stmt)
    }
    catch (e)
{
    console.error(e)
}})


app.use(express.static(process.cwd() + '/public'))
// app.get('/login', (req, res) => {
//     res.sendFile(path.join(initialPath, "Login_Acc/loginPage.html"));
// })

// app.get('/register', (req, res) => {
//     res.sendFile(path.join(initialPath, "Login_Acc/accountCreation.html"));
// })

// app.get('/survey', (req, res) => {
//     res.sendFile(path.join(initialPath, "extraPages/surveyPage.html"));
// })

// app.get('/Login_Acc/form.css', (req, res) => {
//     res.sendFile(path.join(initialPath, "css/form.js"));
// })

// app.get('/js/form.js', (req, res) => {
//     res.sendFile(path.join(initialPath, "js/form.js"));
// })

// app.get('/user-info', (req,res) => {
//     const {email} = req.body;

// })

app.post('/register-user', (req, res) => {

    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        
        const checkBeforeInsert = db.prepare('select * from userlog where email = ?').get(email);
        if (checkBeforeInsert == null){
            
            const run = insertStatement.run(email, password);
            res.json('new user created successfully');

        }
        else{
            res.json('email already exists');
        } 
        
    }
})

app.post('/login-user', (req, res) => {
    //console.log('this endpoint reached')
    const { email, password } = req.body;
    const checkBeforeLogin = db.prepare('select * from userlog where email = ? and password = ?').get(email,password);
    if (checkBeforeLogin == null){
        res.json('email or password is wrong');
    }
    else{
        res.json('need to figure out login');
    }
    
})


