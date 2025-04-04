// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 5020;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// Use Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Configuring Express to handle json and form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


/*
    ROUTES
*/
app.get('/', function(req, res)
    {  
        let query1; "SELECT * FROM Items_In_House;";               // Define our query

        let query2 = "SELECT * FROM Item_Types";

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we

        // Run query 2
        db.pool.query(query2, function
            (error, rows, fields){
                res.render('index', {data: rows});
            })
    });                                                         // received back from the query

    app.post('/add-item-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
        let Expiry_Date = parseInt(data['input-Expiry_Date']);
        if (isNaN(Expiry_Date))
        {
            Expiry_Date = 'NULL'
        }
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Items_In_House (Item_ID, Type_ID, Name, Quantity, Unit, Expiry_Date) VALUES ('${data['input-Item_ID']}', '${data['input-Type_ID']}','${data['input-Name']}','${data['input-Quantity']}','${data['input-Unit']}' ,${Expiry_Date})`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
    
            // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
            // presents it on the screen
            else
            {
                res.redirect('/');
            }
        })
    })

// Delete route 
app.delete('/delete-item-ajax/', function(req,res,next){
    let data = req.body;
    let Item_ID = parseInt(data.id);
    let deleteItem_In_House = `DELETE FROM Items_In_House WHERE pid = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteItem_In_House [Item_ID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
          })
});
// Update route
app.put('/put-item-ajax', function(req,res,next){
    let data = req.body;
  
    let Type = parseInt(data.Type);
    let Item = parseInt(data.Item);
  
    let queryUpdateType = `UPDATE Items_In_House SET Type = ? WHERE Type.id = ?`;
    let selectType= `SELECT * FROM Item_Types WHERE Type_ID = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateType, [Type, Item], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectType, [Type], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});
