/*
Citation for the following file:
    Date: 03/16/2025
    Adapted from the OSU CS340 eCampus Node.js Starter App Guide
    Repo: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

/*  Express and Handlebars Setup   */
const express = require('express');   // We are using the express library for the web server
const app     = express();            // We need to instantiate an express object to interact with the server in our code
const PORT  = 5020;                 // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs',
    engine({extname: ".hbs"}));         // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Configuring Express to handle json and form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

/* Handlebars helper function to format dates */
const moment = require('moment');
const Handlebars = exphbs.create().handlebars
Handlebars.registerHelper('dateFormat', function(date, format) {
    if (date == null) {
        return '';
    }
    return moment(date).format(format);
});
/* End of Setup */

// Database
let db = require('./database/db-connector');

/*  ROUTES  */
app.get('/', function(req, res) {  
    let query1 = "SELECT Items_In_House.Type_ID, Items_In_House.Item_ID, " + 
      "Item_Types.Name AS Type, Items_In_House.Name, Items_In_House.Quantity, " +
      "Items_In_House.Unit, Items_In_House.Expiry_Date " +
      "FROM Items_In_House " +
      "LEFT JOIN Item_Types ON Items_In_House.Type_ID = Item_Types.Type_ID";
    let query2 = "SELECT * FROM Item_Types;";
    if (req.query.Name) {
        let name = req.query.Name;
        console.log(`Searching for: ${name}`);
        query1 = `SELECT * FROM Items_In_House WHERE Name LIKE '%${name}%'`;
    }

    db.pool.query(query1, function(error, rows1) {  // Execute the first query
        if (error) {
            console.log(error);
            res.sendStatus(400);
            return;
        }

        db.pool.query(query2, function(error, rows2) {  // Execute the second query
            if (error) {
                console.log(error);
                res.sendStatus(400);
                return;
            }

            res.render('index', {data: rows1, type: rows2});  // Render the index.hbs file with both query results
        });
    });
});

app.get('/item_types', function(req, res) {
    let query = "SELECT * FROM Item_Types;";  // Define our query

    db.pool.query(query, function(error, rows) {  // Execute the query
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('item_types', {types: rows});  // Render the item_types.hbs file with the query result
        }
    });
});


app.get('/shopping_lists', function(req, res) {
    let query = "SELECT * FROM Shopping_Lists;";  // Define our query

    db.pool.query(query, function(error, rows) {  // Execute the query
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('shopping_lists', {lists: rows});  // Render the shopping_lists.hbs file with the query result
        }
    });
});

app.get('/items_needed', function(req, res) {
    let query = `SELECT ` +
        `Items_In_House.Item_ID, Items_In_House.Name, ` +
        `Shopping_Lists.Shopping_List_ID, Shopping_Lists.Name AS Shopping_List, ` +
        `Items_Needed.Quantity ` +
        `FROM Items_Needed ` +
        `INNER JOIN Items_In_House ON Items_Needed.Item_ID = Items_In_House.Item_ID ` +
        `INNER JOIN Shopping_Lists ON Items_Needed.Shopping_List_ID = Shopping_Lists.Shopping_List_ID`;

    let shoppingListsQuery = `SELECT * FROM Shopping_Lists;`;

    db.pool.query(query, function(error, rows) {  // Execute the query
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(shoppingListsQuery, function(error, shoppingLists) {
                if (error) {
                    console.log(error);
                } else {
                    res.render('items_needed', {itemsNeeded: rows, shoppingLists: shoppingLists});
                }
            });
        }
    });
});

app.get('/recipes', function(req, res) {
    let query = "SELECT * FROM Recipes;";  // Define our query

    db.pool.query(query, function(error, rows) {  // Execute the query
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('recipes', {recipes: rows});  // Render the recipes.hbs file with the query result
        }
    });
});

app.get('/ingredients', function(req, res) {
    let query = `SELECT ` +
                `Ingredients.Item_ID, Ingredients.Recipe_ID, ` +
                `Recipes.Name AS Recipe, Items_In_House.Name AS Item ` +
                `FROM Ingredients ` +
                `INNER JOIN Recipes ON Ingredients.Recipe_ID = Recipes.Recipe_ID ` +
                `INNER JOIN Items_In_House ON Ingredients.Item_ID = Items_In_House.Item_ID`;  // Define our query

    let recipesQuery = `SELECT * FROM Recipes`;
    let itemsQuery = `SELECT * FROM Items_In_House`;

    db.pool.query(query, function(error, rows) {  // Execute the query
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(recipesQuery, function(error, recipeRows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    db.pool.query(itemsQuery, function(error, itemRows) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.render('ingredients', {ingredients: rows, recipes: recipeRows, items:itemRows});  // Render the ingredients.hbs file with the query result
                        }
                    });
                }
            });
        }
    });
});

app.post('/add-item-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    let query1 = `INSERT INTO Items_In_House (Item_ID, Type_ID, Name, Quantity, Unit, Expiry_Date) VALUES ('${data['input-Item_ID']}', ${data['input-Type_ID']},'${data['input-Name']}','${data['input-Quantity']}','${data['input-Unit']}' ,'${data['input-Expiry_Date']}')`;

    // Capture NULL values
    if (data['input-Expiry_Date'].length === 0) {
        query1 = `INSERT INTO Items_In_House (Item_ID, Type_ID, Name, Quantity, Unit, Expiry_Date) VALUES ('${data['input-Item_ID']}', ${data['input-Type_ID']},'${data['input-Name']}','${data['input-Quantity']}','${data['input-Unit']}' , NULL)`;
    }

    db.pool.query(query1, function(error) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, we redirect back to our root route
            res.redirect('/');
        }
    });
});

// Route to add a new item type
app.post('/add-type-form', function(req, res) {
    let data = req.body;
    let query = `INSERT INTO Item_Types (Name) VALUES ('${data['input-Name']}')`;

    db.pool.query(query, function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/item_types');
        }
    });
});

app.post('/add-list-form', function(req, res) {
    let data = req.body;
    let query = `INSERT INTO Shopping_Lists (Name) VALUES ("${data['input-Name']}")`;

    db.pool.query(query, function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/shopping_lists');
        }
    });
});

app.post('/add-item-needed-form', async function (req, res) {
    let data = req.body;

    // Query to check if the item exists yet
    let selectItemIDQuery = `SELECT Item_ID ` +
                            `FROM Items_In_House ` +
                            `WHERE UPPER(Name) LIKE UPPER('${data['input-Item-Name']}%')`;
    let insertItemQuery = `INSERT INTO Items_In_House (Name, Quantity, Unit) ` +
                            `VALUES ` +
                            `('${data['input-Item-Name']}', 0, ' ')`;

    db.pool.query(selectItemIDQuery, function(error, rows) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            if (rows.length > 0) {
                let query = `INSERT INTO Items_Needed (Item_ID, Shopping_List_ID, Quantity) ` +
                    `VALUES ('${rows[0].Item_ID}', '${data['input-List-ID']}', '${data['input-Quantity']}')`;
                db.pool.query(query, function(error) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                        return;
                    }
                    res.redirect('/items_needed');
                });
            } else {
                db.pool.query(insertItemQuery, function(error, insertRows) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    let query = `INSERT INTO Items_Needed (Item_ID, Shopping_List_ID, Quantity) ` +
                        `VALUES ('${insertRows.insertId}', '${data['input-List-ID']}', '${data['input-Quantity']}')`;
                    db.pool.query(query, function(error) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.redirect('/items_needed');
                        }
                    });
                });
            }
        }
    });


});

app.post('/add-recipe-form', function(req, res) {
    let data = req.body;
    let query = `INSERT INTO Recipes (Name, Instructions, Description) VALUES ('${data['input-Name']}', '${data['input-Instructions']}', '${data['input-Description']}')`;

    db.pool.query(query, function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/recipes');
        }
    });
});

app.post('/add-ingredient-form', function(req, res) {
    let data = req.body;
    let query = `INSERT INTO Ingredients (Item_ID, Recipe_ID) VALUES ('${data['input-Item_ID']}', '${data['input-Recipe_ID']}')`;

    db.pool.query(query, function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/ingredients');
        }
    });
});

// Delete route 
app.delete('/delete-item-ajax/', function(req, res) {
    let data = req.body;
    let Item_ID = parseInt(data.id);
    let deleteItem_In_House = `DELETE FROM Items_In_House WHERE Item_ID = ?`;

    // Run the query
    db.pool.query(deleteItem_In_House, [Item_ID], function(error) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);  // No Content
        }
    });
});


// Route to delete an item type
app.delete('/delete-type/:id', function(req, res) {
    let Type_ID = parseInt(req.params.id);
    let query = `DELETE FROM Item_Types WHERE Type_ID = ?`;

    db.pool.query(query, [Type_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);  // No Content
        }
    });
});

// Route to delete a shopping list
app.delete('/delete-list/:id', function(req, res) {
    let Shopping_List_ID = parseInt(req.params.id);
    let query = `DELETE FROM Shopping_Lists WHERE Shopping_List_ID = ?`;

    db.pool.query(query, [Shopping_List_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);  // No Content
        }
    });
});

// Route to delete an item
app.delete('/delete-item/:itemID', function(req, res) {
    let Item_ID = parseInt(req.params.itemID);
    let query = `DELETE FROM Items_In_House WHERE Item_ID = ?`;

    db.pool.query(query, [Item_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204)
        }
    })
})

// Route to delete an item needed
app.delete('/delete-item-needed/:itemID/:listID', function(req, res) {
    let Item_ID = parseInt(req.params.itemID);
    let Shopping_List_ID = parseInt(req.params.listID);
    let query = `DELETE FROM Items_Needed WHERE Item_ID = ? AND Shopping_List_ID = ?`;

    db.pool.query(query, [Item_ID, Shopping_List_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);  // No Content
        }
    });
});

// Route to delete a recipe
app.delete('/delete-recipe/:id', function(req, res) {
    let Recipe_ID = parseInt(req.params.id);
    let query = `DELETE FROM Recipes WHERE Recipe_ID = ?`;

    db.pool.query(query, [Recipe_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);  // No Content
        }
    });
});

// Route to delete an ingredient
app.delete('/delete-ingredient/:itemID/:recipeID', function(req, res) {
    let Item_ID = parseInt(req.params.itemID);
    let Recipe_ID = parseInt(req.params.recipeID);
    let query = `DELETE FROM Ingredients WHERE Item_ID = ? AND Recipe_ID = ?`;

    db.pool.query(query, [Item_ID, Recipe_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);  // No Content
        }
    });
});

// Update item route
app.put('/update-item-form', function(req, res) {
    let data = req.body;

    let queryUpdateItem = `UPDATE Items_In_House SET ` +
        `Type_ID = ${data.Type_ID},` +
        `Quantity = ${data.Quantity},` +
        `Unit = "${data.Unit}",` +
        `Expiry_Date = "${data.Expiry_Date}" ` +
        `WHERE Item_ID = ${data.Item_ID}`;
    if (data.Expiry_Date.length === 0) {
        queryUpdateItem = `UPDATE Items_In_House SET ` +
            `Type_ID = ${data.Type_ID},` +
            `Quantity = ${data.Quantity},` +
            `Unit = "${data.Unit}",` +
            `Expiry_Date = NULL ` +
            `WHERE Item_ID = ${data.Item_ID}`;
    }


    console.log(`SQL Query: ${queryUpdateItem}`);
    // Run the 1st query
    db.pool.query(queryUpdateItem, function(error, rows) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }
    });
});

// Update route for item types
app.put('/update-type-form', function(req, res) {
    let data = req.body;

    let Type_ID = parseInt(data.Type_ID);
    let Name = data.Name;

    let queryUpdateType = `UPDATE Item_Types SET Name = ? WHERE Type_ID = ?`;
    let selectType = `SELECT * FROM Item_Types WHERE Type_ID = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateType, [Name, Type_ID], function(error) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the second query
            db.pool.query(selectType, [Type_ID], function(error, rows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// Route to update a shopping list
app.put('/update-list-form', function(req, res) {
    let data = req.body;

    let Shopping_List_ID = data.Shopping_List_ID;
    let Name = data.Name;

    let queryUpdateList = `UPDATE Shopping_Lists SET Name = ? WHERE Shopping_List_ID = ?`;
    let selectList = `SELECT * FROM Shopping_Lists WHERE Shopping_List_ID = ?`;

    // Run the update query
    db.pool.query(queryUpdateList, [Name, Shopping_List_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to return the updated list
            db.pool.query(selectList, [Shopping_List_ID], function(error, rows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.json(rows);  // Send the updated list as the response
                }
            });
        }
    });
});

// Route to update an item needed
app.put('/update-item-needed-form', function(req, res) {
    let data = req.body;
    let Item_ID = parseInt(data.Item_ID);
    let Shopping_List_ID = parseInt(data.Shopping_List_ID);
    let Quantity = data.Quantity;

    let queryUpdateItemNeeded = `UPDATE Items_Needed SET Quantity = ? WHERE Item_ID = ? AND Shopping_List_ID = ?`;
    let selectItemNeeded = `SELECT * FROM Items_Needed WHERE Item_ID = ? AND Shopping_List_ID = ?`;

    // Run the update query
    db.pool.query(queryUpdateItemNeeded, [Quantity, Item_ID, Shopping_List_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to return the updated item
            db.pool.query(selectItemNeeded, [Item_ID, Shopping_List_ID], function(error, rows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.json(rows);  // Send the updated item as the response
                }
            });
        }
    });
});

// Route to update a recipe
app.put('/update-recipe-form', function(req, res) {
    let data = req.body;
    let Recipe_ID = parseInt(data.Recipe_ID);
    let Name = data.Name;
    let Instructions = data.Instructions;
    let Description = data.Description;

    let queryUpdateRecipe = `UPDATE Recipes SET Name = ?, Instructions = ?, Description = ? WHERE Recipe_ID = ?`;
    let selectRecipe = `SELECT * FROM Recipes WHERE Recipe_ID = ?`;

    // Run the update query
    db.pool.query(queryUpdateRecipe, [Name, Instructions, Description, Recipe_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to return the updated recipe
            db.pool.query(selectRecipe, [Recipe_ID], function(error, rows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.json(rows);  // Send the updated recipe as the response
                }
            });
        }
    });
});

// Route to update an ingredient
app.put('/update-ingredient', function(req, res) {
    let data = req.body;
    let queryUpdateIngredient = `UPDATE Ingredients SET Item_ID = ? WHERE Recipe_ID = ? AND Item_ID = ?`;
    let selectIngredient = `SELECT * FROM Ingredients WHERE Item_ID = ? AND Recipe_ID = ?`;

    // Run the update query
    db.pool.query(queryUpdateIngredient, [data.New_Item_ID, data.Recipe_ID, data.Item_ID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to return the updated ingredient
            db.pool.query(selectIngredient, [data.New_Item_ID, data.Recipe_ID], function(error, rows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.json(rows);  // Send the updated ingredient as the response
                }
            });
        }
    });
});

/*
    LISTENER
*/
app.listen(PORT, function() {  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});
