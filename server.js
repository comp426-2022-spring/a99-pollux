const express = require('express')
const app = express()
const morgan = require('morgan')
const db = require('./database')
const path = require('path')

const insertStatement = db.prepare('INSERT INTO userlog (name, email, password) VALUES (?, ?, ?)');

function firstDateLessThanSecondDate(day1,month1,year1,day2,month2,year2){
    if (year1 < year2){
        return true; 
    }
    if (year1 == year2 && month1 < month2){
        return true;
    }
    if (year1 == year2 && month1 == month2 && day1 < day2){
        return true;
    }

    return false;
}

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

app.post('/register-user', (req, res) => {
    console.log('try to register')
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.status(400);
        res.json({
            message : "fill out all fields"
        });
    } else{
        
        const checkBeforeInsert = db.prepare('select * from userlog where email = ?').get(email);
        if (checkBeforeInsert == null){
            
            const run = insertStatement.run(name, email, password);
            res.status(200);
            res.json({
                message : "user created successfully"
            });

        }
        else{
            res.status(400);
            res.json({
                message : "email associated to another user"
            });
        } 
        
    }
})

app.post('/login-user', (req, res) => {
    console.log('login')
    const { email, password } = req.body;
    if (!email.length || !password.length){
        res.status(400);
        res.json({
            message : "fill out all fields"
        })
        return;
    }
    const checkBeforeLogin = db.prepare('select * from userlog where email = ? and password = ?').get(email,password);
    if (checkBeforeLogin == null){
        res.status(400);
        res.json({
            message : "email,password combo does not exist"
        })
        return;
        
    }
    else{
        const token =  Math.floor(Math.random() * 1000000000);
        const insertStatement = db.prepare('INSERT INTO tokentable (token, email) VALUES (?, ?)');
        const run = insertStatement.run(token, email);
        res.status(200);
        res.json({
            message : "login successful",
            loginToken :  token
        });
        return;
    }
    
})

app.post('/get-wellness', (req,res) => {
    console.log('getting wellness data')
    const token = req.body.token;
    //console.log(token);
    const tokenUser = db.prepare('select * from tokentable where token = ?').get(token);
    //const cat = tokenUser.get(3333);
    //console.log(cat);
    //console.log(tokenUser);
    if (tokenUser == undefined){
        res.status(400);
        res.json({
            message : "token not found in tokentable"
        })
        return;
    }
    else if (tokenUser.length){
        res.status(400);
        res.json({
            message : "this token corresponds to multiple users"
        })
        return;
    }
    else{
        const email = tokenUser.Email;
        const bunchofdata = db.prepare('select * from wellnesslog where email = ?').all(email);
        //const bunchofdata = db.prepare('select distinct email,wellness_rating,day,month,year from wellnesslog where email = ? group by day').get(email);
        //console.log(bunchofdata)
        if (bunchofdata == undefined){
         //console.log(email);
         res.status(400);
            res.json(
                {message : "email not found in wellnesslog"
            }
            );
            return;
        }
        else{
            //console.log(bunchofdata);
            if (bunchofdata.length == undefined){
                res.status(200);
                res.json({
                    message : "wellness retrieved successfully",
                    email : email,
                    dayArray : [bunchofdata.Day],
                    monthArray : [bunchofdata.Month],
                    yearArray : [bunchofdata.Year],
                    wellnessArray : [bunchofdata.Wellness_rating]
                })
                return;
            }
            else{
                let dayArray = [];
                let monthArray = [];
                let yearArray = [];
                let wellnessArray = [];
                for (let i = 0; i < bunchofdata.length; i++){
                    dayArray.push(bunchofdata[i].Day);
                    monthArray.push(bunchofdata[i].Month);
                    yearArray.push(bunchofdata[i].Year);
                    wellnessArray.push(bunchofdata[i].Wellness_rating);
                }
                //bubble sort :/
                for(var i = 0; i < dayArray.length; i++){
     
                     
                    for(var j = 0; j < ( dayArray.length - i -1 ); j++){
                        
                      
                      //if(dayArray[j] > dayArray[j+1] && monthArray[j] > monthArray[j+1] && yearArray[j] > yearArray[j+1]){
                        if (firstDateLessThanSecondDate(dayArray[j+1], monthArray[j+1], yearArray[j+1], dayArray[j], monthArray[j], yearArray[j])){  
                        
                        var tempday = dayArray[j]
                        var tempmonth = monthArray[j]
                        var tempyear = yearArray[j]
                        var tempwellness = wellnessArray[j]

                        dayArray[j] = dayArray[j+1];
                        monthArray[j] = monthArray[j+1];
                        yearArray[j] = yearArray[j+1];
                        wellnessArray[j] = wellnessArray[j+1];

                        dayArray[j+1] = tempday;
                        monthArray[j+1] = tempmonth;
                        yearArray[j+1] = tempyear;
                        wellnessArray[j+1] = tempwellness;

                        //arr[j] = arr[j + 1]
                        //arr[j+1] = temp
                      }
                    }
                  }


                res.status(200);
                res.json({
                    message : "wellness retrieved successfully",
                    email : email,
                    dayArray : dayArray,
                    monthArray : monthArray,
                    yearArray : yearArray,
                    wellnessArray : wellnessArray
                })
                return;
            }
        }
    }
         
    
})

app.post('/insert-wellness', (req,res) => {
    console.log('inserting wellness data')
    //const {token, wellness, day, month, year} = req.body;
    const token = req.body.token;
    const wellness = req.body.wellness;
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;
    //const tokenUser = db.prepare('select * from tokentable where token = ?').get(token);
    const tokenUser = db.prepare('select * from tokentable where token = ?').get(token);
    console.log(tokenUser);
    if (tokenUser == null){
        res.status(400);
        res.json({
            message : "token not found in tokentable"
        })
        return;
    }
    else if (tokenUser.length){
        res.status(400);
        res.json({
            message : "this token corresponds to multiple users"
            //this should never occur but if it does then we fucked something up
        })
        return;
    }
    else{
        const email = tokenUser.Email;
        console.log(email);
        const existingWellness = db.prepare('select * from wellnesslog where email = ? and day = ? and month = ? and year = ?').get(email, day, month, year);
        if (existingWellness != undefined){
            res.status(400);
            res.json({
                message: "wellness for this day has already been inserted"
            })
            return;
        }
        else{
            const stmt = db.prepare('INSERT INTO wellnesslog (email, Wellness_rating, Day, Month, Year) VALUES (?, ?, ?, ?, ?)')
            const info = stmt.run(email, wellness, day, month, year)
            res.status(200);
            res.json({
                message: "wellness for today has been inserted"
            })
            return;
        }
        
    }
         
    
})

app.post('/logout-user', (req,res) => {
    console.log('logging out')
    
    const token = req.body.token;
    const tokenUser = db.prepare('select * from tokentable where token = ?').get(token);
    if (tokenUser == undefined){
        res.status(400);
        res.json({
            message : "token not found in tokentable"
        })
        return;
    }
    else if (tokenUser.length){
        res.status(400);
        res.json({
            message : "this token corresponds to multiple users"
        })
        return;
    }
    else{
        const deleteStatement = db.prepare('delete from tokentable where token = ?');
        const run = deleteStatement.run(token);
        res.status(200);
        res.json({
            message : "user's token deleted from token table"
        })
        return;
        //const run = insertStatement.run(token, email);
    }
})






