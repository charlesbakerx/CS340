-- CS 340 Project Step 2 Draft
-- Project Name: Family Planner Database
-- Team 84
-- Members: Charles Baker, Kapri Sanders

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;


-- Creating the tables
DROP TABLE IF EXISTS Item_Types;
Create TABLE Item_Types(
	Type_ID INT NOT NULL AUTO_INCREMENT UNIQUE,
    Name varchar(255) NOT NULL,
    PRIMARY KEY (Type_ID)
);

DROP TABLE IF EXISTS Items;
CREATE TABLE Items(
  Item_ID INT NOT NULL AUTO_INCREMENT UNIQUE,
  Type_ID INT,
  Name varchar(255) NOT NULL,
  PRIMARY KEY (Item_ID),
  FOREIGN KEY (Type_ID) references Item_Types(Type_ID)
);

DROP TABLE IF EXISTS Items_In_House;
Create TABLE Items_In_House (
    Item_ID INT NOT NULL,
    Quantity INT NOT NULL,
    Unit varchar(50) NOT NULL,
    Expiry_Date DATE,
    PRIMARY KEY (Item_ID),
    Foreign Key (Item_ID) references Items(Item_ID) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Shopping_Lists;
CREATE TABLE Shopping_Lists(
	Shopping_List_ID INT NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    PRIMARY KEY (Shopping_List_ID)
);

DROP TABLE IF EXISTS Items_Needed;
CREATE TABLE Items_Needed(
	Item_ID INT NOT NULL,
    Shopping_List_ID INT NOT NULL,
    Quantity INT NOT NULL,
    Unit varchar(50) NOT NULL,
    PRIMARY KEY(Item_ID, Shopping_List_ID),
    FOREIGN KEY(Item_ID) References Items(Item_ID) ON DELETE CASCADE,
    FOREIGN KEY(Shopping_List_ID) References Shopping_Lists(Shopping_List_ID) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Recipes;
CREATE TABLE Recipes(
	Recipe_ID INT NOT NULL AUTO_INCREMENT UNIQUE,
    Name varchar(255) NOT NULL,
    Instructions text NOT NULL,
    Description text,
    PRIMARY KEY (Recipe_ID)
);

DROP TABLE IF EXISTS Ingredients;
CREATE TABLE Ingredients(
	Item_ID INT NOT NULL,
    Recipe_ID INT NOT NULL,
    PRIMARY KEY (Item_ID, Recipe_ID),
    Foreign Key (Item_ID) References Items(Item_ID) ON DELETE CASCADE,
    Foreign Key(Recipe_ID) References Recipes(Recipe_ID) ON DELETE CASCADE
);
	
SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 1;
COMMIT; 

-- Inserting the Data from the example data tables
INSERT INTO Item_Types(Name)
VALUES('Cleaning'),
('Food'),
('Toiletries');

INSERT INTO Items(Type_ID, Name)
VALUES
((SELECT Type_ID FROM Item_Types WHERE Name = 'Cleaning'),'Fabuloso'),
((SELECT Type_ID FROM Item_Types WHERE Name = 'Food'),'Bananas'),
((SELECT Type_ID FROM Item_Types WHERE Name = 'Toiletries'),'Toilet Paper'),
((SELECT Type_ID FROM Item_Types WHERE Name = 'Food'),'Butter'),
((SELECT Type_ID FROM Item_Types WHERE Name = 'Food'),'Flour');

INSERT INTO Items_In_House(Item_ID, Quantity, Unit, Expiry_Date)
VALUES
((SELECT Item_ID FROM Items WHERE Name = 'Fabuloso'), 1, 'Bottle', NULL),
((SELECT Item_ID FROM Items WHERE Name = 'Bananas'), 3, 'Single', NULL),
((SELECT Item_ID FROM Items WHERE Name = 'Toilet Paper'), 12, 'Rolls', NULL),
((SELECT Item_ID FROM Items WHERE Name = 'Butter'), 4, 'Sticks', NULL);


INSERT INTO Shopping_Lists(Name)
VALUES('Walmart'),
('Target'),
('Sam\'s');

INSERT INTO Items_Needed(Item_ID, Shopping_List_ID, Quantity, Unit)
VALUES
((SELECT Item_ID FROM Items WHERE Name = 'Fabuloso'), (SELECT Shopping_List_ID FROM Shopping_Lists WHERE Name = 'Walmart'), 1, 'Bottle'),
((SELECT Item_ID FROM Items WHERE Name = 'Bananas'), (SELECT Shopping_List_ID FROM Shopping_Lists WHERE Name = 'Walmart'), 2, 'Single'),
((SELECT Item_ID FROM Items WHERE Name = 'Toilet Paper'), (SELECT Shopping_List_ID FROM Shopping_Lists WHERE Name = 'Walmart'), 1, '12 Pack');

INSERT INTO Recipes(Name, Instructions, Description)
VALUES('Banana Bread', 'Bake at 325 for 1 hour', 'Family Recipe'),
('Tacos','Brown Meat with seasoning and add toppings','Easy Meal'),
('Mac+Cheese','Cook Pasta and add cheese butter and milk', 'Kid Favorite');

INSERT INTO Ingredients(Item_ID, Recipe_ID)
VALUES
((SELECT Item_ID FROM Items WHERE Name = 'Bananas'), (SELECT Recipe_ID FROM Recipes WHERE Name = 'Banana Bread')),
((SELECT Item_ID FROM Items WHERE Name = 'Butter'), (SELECT Recipe_ID FROM Recipes WHERE Name = 'Banana Bread')),
((SELECT Item_ID FROM Items WHERE Name = 'Flour'), (SELECT Recipe_ID FROM Recipes WHERE Name = 'Banana Bread'));
