-- Select statements that will support the READ operation for each table
SELECT * FROM Item_Types
ORDER BY Type_ID ASC ;

SELECT * FROM Items_In_House
ORDER BY Name ASC;

SELECT * FROM Recipes
ORDER BY Recipe_ID ASC;

SELECT * FROM Ingredients
WHERE Recipe_ID = ?;

SELECT * FROM Shopping_Lists
ORDER BY Shopping_List_ID ASC;

SELECT * FROM Items_Needed
WHERE Shopping_List_ID = ?;

-- Insert statements to add items

-- Adds a new item to the house inventory
INSERT INTO Items_In_House (Type_ID, Name, Quantity, Unit, Expiry_Date)
VALUES(
Type_ID = :typeIDInput,
Name = :nameInput,
Quantity = :quantityInput,
Unit = :unitInput
Expiry_Date = :expiryDateInput
);

-- Adds a new item type
INSERT INTO Item_Type (Name)
Values(Name = :nameInput);

-- Adds a new recipe
INSERT INTO Recipies( Name, Instructions, Description)
Values(
Name = :nameInput,
Instructions = :instructionsInput,
Description = :descriptionInput
);

-- Adds a new ingredient to a recipe
INSERT INTO Ingredients(Item_ID, Recipe_ID)
Values(
Item_ID = :itemIDInput,
Recipe_ID = :recipeIDInput,
);

-- Adds a new item to the item needed list
Insert INTO Items_Needed(Item_ID, Shopping_List_ID, Quantity)
Values(
Item_ID = :itemIDInput,
Shopping_List_ID = : shoppingListIDInput,
Quantity = :quantityInput
);

-- Adds a new item to the shopping list
INSERT INTO Shopping_Lists(Name)
Values(Name = :nameInput);

-- Update statements in order to update the items

-- Updates the quantity of an item in the house
UPDATE Items_In_House
SET 
Type_ID = :typeIDInput,
Name = :nameInput,
Quantity = :quantityInput,
Unit = :unitInput,
Expiry_Date = :expiryDateInput
WHERE Item_ID = :Item_IDFromUpdateForm;

-- updates the types of items
UPDATE Item_Types
SET
Name = :nameInput
WHERE Type_ID = : Type_IDFromUpdateForm;

-- updates the recipies
UPDATE Recipes
SET
Name = :nameInput,
Instructions = :instructionsInput,
Description = :descriptionInput
WHERE Recipe_ID = :Recipe_IDFromUpdateForm;

-- updates the ingredients to a recipe
UPDATE Ingredients
SET 
Item_ID = :itemIDInput,
Recipe_ID = :recipeIDInput,
WHERE Ingredients_ID = :Ingredients_IDFromUpdateForm;

-- updates the items needed list
UPDATE Items_Needed
SET
Item_ID = :itemIDInput,
Shopping_List_ID = : shoppingListIDInput,
Quantity = :quantityInput
WHERE Items_Needed = : Items_NeededFromUpdateForm;

-- updates the shopping list
UPDATE Shopping_Lists
SET 
Name = :nameInput
WHERE Shopping_List_ID = :Shopping_List_IDFromUpdateForm



-- Delete statements

-- Deletes an item from the house inventory
DELETE FROM Items_In_House
WHERE Item_ID = ?;

-- Deletes an item type
DELETE FROM Item_Types
WHERE Type_ID = ?;

-- Deletes a recipe
DELETE FROM Recipes
WHERE Recipe_ID =?;

-- Deletes an ingredient from a recipe
DELETE FROM Ingredients
WHERE Item_ID = ?;

-- Deletes an item from the item needed list
DELETE FROM Items_Needed
WHERE Item_ID = ?;

-- Deletes an item from the shopping list
DELETE FROM Shopping_Lists
WHERE Item_ID =?;
