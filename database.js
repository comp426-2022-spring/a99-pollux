// Require better-sqlite.
const Database = require('better-sqlite3');

// Connect to a database or create one if it doesn't exist yet.
const db = new Database('wellness.db');


// CREATING user login TABLE


// Is the database initialized or do we need to initialize it?
const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='userlog';`);

// Define row using `get()` from better-sqlite3
let row = stmt.get();

// Check if there is a table. If row is undefined then no table exists.
if (row === undefined) {

// Set a const that will contain your SQL commands to initialize the database.
    const sqlInit = `CREATE TABLE userlog ( id INTEGER NOT NULL PRIMARY KEY, email TEXT, password TEXT);`;

// Execute SQL commands that we just wrote above.
    db.exec(sqlInit);

} else {
// Since the database already exists, echo that to the console.
    console.log('User database exists.')
}


//CREATING WELLNESS TABLE

// Is the database initialized or do we need to initialize it?
const stmt2 = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='wellnesslog';`);

// Define row using `get()` from better-sqlite3
let row2 = stmt2.get();

// Check if there is a table. If row is undefined then no table exists.
if (row2 === undefined) {

// Set a const that will contain your SQL commands to initialize the database.
    const sqlInit = `CREATE TABLE wellnesslog ( id INTEGER NOT NULL PRIMARY KEY, email TEXT, wellness_rating INTEGER);`;

// Execute SQL commands that we just wrote above.
    db.exec(sqlInit);

} else {
// Since the database already exists, echo that to the console.
    console.log('Wellness database exists.')
}

// Export all of the above as a module so that we can use it elsewhere.
module.exports = db

