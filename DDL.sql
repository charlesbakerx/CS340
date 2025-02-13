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

DROP TABLE IF EXISTS Items_In_House;
Create TABLE Items_In_House (
	Item_ID INT NOT NULL AUTO_INCREMENT UNIQUE,
    Type_ID INT,
    Name varchar(255) NOT NULL,
    Quantity INT NOT NULL,
    Unit varchar(50) NOT NULL,
    Expiry_Date DATE,
    PRIMARY KEY (Item_ID),
    Foreign Key (Type_ID) references Item_Types(Type_ID) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Shopping_Lists;
CREATE TABLE Shopping_Lists(
	Shopping_List_ID INT NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    PRIMARY KEY (Shopping_List_ID)
);

DROP TABLE IF EXISTS Items_Needed;
CREATE TABLE Items_Needed(
	Item_ID INT,
    Shopping_List_ID INT,
    Quantity INT NOT NULL,
    PRIMARY KEY(Item_ID, Shopping_List_ID),
    FOREIGN KEY(Item_ID) References Items_In_House(Item_ID) ON DELETE CASCADE,
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
	Item_ID int,
    Recipe_ID int,
    PRIMARY KEY (Item_ID, Recipe_ID),
    Foreign Key (Item_ID) References Items_In_House(Item_ID) ON DELETE CASCADE,
    Foreign Key(Recipe_ID) References Recipes(Recipe_ID) ON DELETE CASCADE
);
	
SET FOREIGN_KEY_CHECKS = 1;
COMMIT; 

-- Inserting the Data from the example data tables
INSERT INTO Item_Types(Name)
VALUES('Cleaning'),
('Food'),
('Toiletries');

INSERT INTO Items_In_House(Type_ID, Name, Quantity, Unit, Expiry_Date)
VALUES
((SELECT Type_ID FROM Item_Types WHERE Name = 'Cleaning'),'Fabuloso',1,'Bottle', NULL),
((SELECT Type_ID FROM Item_Types WHERE Name = 'Food'),'Bananas',6,'Single', '2025-02-08'),
((SELECT Type_ID FROM Item_Types WHERE Name = 'Toiletries'),'Toilet Paper',1,'Package', NULL),
((SELECT Type_ID FROM Item_Types WHERE Name = 'Food'),'Butter',4,'Sticks', NULL),
((SELECT Type_ID FROM Item_Types WHERE Name = 'Food'),'Flour',1,'kg', NULL);

INSERT INTO Shopping_Lists(Name)
VALUES('Walmart'),
('Target'),
('Sams');

INSERT INTO Items_Needed(Item_ID, Shopping_List_ID, Quantity)
VALUES(1,1,1),
(2,1,2),
(3,1,1);

INSERT INTO Recipes(Name, Instructions, Description)
VALUES('Banana Bread', 'Bake at 325 for 1 hour', 'Family Recipe'),
('Tacos','Brown Meat with seasoning and add toppings','Easy Meal'),
('Mac+Cheese','Cook Pasta and add cheese butter and milk', 'Kid Favorite');

INSERT INTO Ingredients(Item_ID, Recipe_ID)
VALUES(2,1),
(4,1),
(5,1);
