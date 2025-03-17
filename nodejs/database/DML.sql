-- Selects --
SELECT * FROM Item_Types;
SELECT * FROM Items_In_House;
SELECT * FROM Item_Types;
SELECT * FROM Shopping_Lists;
SELECT * FROM Recipes;

SELECT * FROM Item_Types WHERE Type_ID = ':inputID';
SELECT * FROM Shopping_Lists WHERE Shopping_List_ID = ':inputID';
SELECT * FROM Recipes WHERE Recipe_ID = ':inputID';

SELECT * FROM Items_In_House WHERE Name LIKE ':inputName%';

-- Used to pass all needed data to the table at / --
SELECT Items_In_House.Type_ID, Items_In_House.Item_ID,
       Item_Types.Name AS Type, Items_In_House.Name, Items_In_House.Quantity,
       Items_In_House.Unit, Items_In_House.Expiry_Date
FROM Items_In_House
         LEFT JOIN Item_Types ON Items_In_House.Type_ID = Item_Types.Type_ID;

-- Used to pass all needed data to the table at /items_needed --
SELECT Items_In_House.Item_ID, Items_In_House.Name, Shopping_Lists.Shopping_List_ID,
       Shopping_Lists.Name AS Shopping_List, Items_Needed.Quantity
FROM Items_Needed
         INNER JOIN Items_In_House ON Items_Needed.Item_ID = Items_In_House.Item_ID
         INNER JOIN Shopping_Lists ON Items_Needed.Shopping_List_ID = Shopping_Lists.Shopping_List_ID;

-- Used to pass all needed data to the table at /ingredients --
SELECT Ingredients.Item_ID, Ingredients.Recipe_ID, Recipes.Name AS Recipe,
       Items_In_House.Name AS Item
FROM Ingredients
         INNER JOIN Recipes ON Ingredients.Recipe_ID = Recipes.Recipe_ID
         INNER JOIN Items_In_House ON Ingredients.Item_ID = Items_In_House.Item_ID;

-- Used as part of an insert function to check if the item exists before adding it --
SELECT Item_ID FROM Items_In_House
WHERE UPPER(Name) LIKE UPPER(':inputName');

-- Inserts --

-- This version is used if passed a valid date otherwise NULL is passed for Expiry_Date --
INSERT INTO Items_In_House (Item_ID, Type_ID, Name, Quantity, Unit, Expiry_Date)
VALUES (':inputItemID', ':inputTypeID', ':inputName',
        ':inputQuantity', ':inputUnit', ':inputExpiryDate');

INSERT INTO Item_Types (Name) VALUES (':inputName');
INSERT INTO Shopping_Lists (Name) VALUES (':inputName');
INSERT INTO Items_In_House (Name, Quantity, Unit) VALUES (':inputName', 0, ' ');

INSERT INTO Items_Needed (Item_ID, Shopping_List_ID, Quantity)
VALUES (':itemID', ':inputListID', ':inputQuantity');

INSERT INTO Recipes (Name, Instructions, Description)
VALUES (':inputName', ':inputInstructions', ':inputDescription');

INSERT INTO Ingredients (Item_ID, Recipe_ID) VALUES (':inputItemID', ':inputRecipeID');

-- Deletes --

DELETE FROM Items_In_House WHERE Item_ID = ':inputID';
DELETE FROM Item_Types WHERE Type_ID = ':inputID';
DELETE FROM Shopping_Lists WHERE Shopping_List_ID = ':inputID';
DELETE FROM Items_Needed WHERE Item_ID = ':inputItemID' AND Shopping_List_ID = ':inputListID';
DELETE FROM Recipes WHERE Recipe_ID = ':inputID';
DELETE FROM Ingredients WHERE Item_ID = ':inputItemID' AND Recipe_ID = ':inputRecipeID';

-- Updates --

UPDATE Items_In_House SET
                          Type_ID     = ':inputTypeID',
                          Quantity    = ':inputQuantity',
                          Unit        = ':inputUnit',
                          Expiry_Date = ':inputExpiryDate'
WHERE Item_ID = ':inputID';

UPDATE Item_Types
SET Name = ':inputName'
WHERE Type_ID = ':inputID';

UPDATE Shopping_Lists
SET Name = ':inputName'
WHERE Shopping_List_ID = ':inputID';

UPDATE Items_Needed
SET Quantity = ':inputQuantity'
WHERE Item_ID = ':inputItemID' AND Shopping_List_ID = ':inputListID';

UPDATE Recipes
SET Name         = ':inputName',
    Instructions = ':inputInstructions',
    Description  = ':inputDescription'
WHERE Recipe_ID = ':inputID';

UPDATE Ingredients
SET Item_ID   = ':inputItemID'
WHERE Item_ID = ':oldItemID' AND Recipe_ID = ':inputRecipeID';


