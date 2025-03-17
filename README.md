# Family Planner Database App
#### By Kapri Sanders and Charles Baker

## Overview
Many households struggle to effectively manage what supplies they have on hand or what they need to purchase. The items include: food, cleaning supplies, or  various household items. Over time some items that are in stock can be forgotten and may expire, or maybe important supplies are allowed to run low and risk not having enough when they are needed. For example, a typical household of 4 might have 100+ different pantry items from canned goods to spices, dozens if not more cleaning supplies, and depending on preference maybe even 20+ pounds of frozen goods. Without a system, and with multiple family members each contributing to the consumption and replenishment of supplies, it is easy to mismanage the inventory, leading to an average of 20% of food going unused and expired. 

Additionally, meal planning can be inefficient, and sometimes very difficult, when it is unclear which ingredients are available for cooking. This leads to either overstocking of some items or forgetting to put something on the shopping list entirely because you thought you had plenty already. A family typically needs to plan for 3 meals a day, potentially snacks throughout the day, and need to accommodate any dietary restrictions. 

A database driven application aligns well with the goals of this project, as it can easily manage a variety of types of data such as Items_In_House, representing physical goods stored in any given household, and Recipes, whose ingredients are a subset of Items_In_House. In addition, a database also allows for the Items_In_House to be easily classified using Item_Types and quantified using a Quantity attribute. This enables us to easily draw up a recipe plan and compile a list of ingredients we will need to buy based on what we need, drawn from Recipes, and what we have, drawn from Items_In_House.

## Database Outline
- Item_Types: a preset selection of categories to describe the item e.g., “Food”, “Cleaning Supplies”, etc
    - Type_ID: int, auto_increment, unique, nn, pk
    - Name: varchar, nn 
    - Relationship: a 1:M relationship, with Items_In_House using Type_ID as a FK
- Items_In_House: stores the details of items we have in storage
    - Item_ID: int, auto_increment, unique, nn, pk
    - Type_ID: int, fk
    - Name: varchar, nn
    - Quantity: int, nn
    - Unit: varchar, nn ; ex: x boxes of pasta, x cases of water, x rolls of toilet paper whatever measurement unit an item is commonly stored in
    - Expiry_Date: date
    - Relationship: a M:1 relationship with Item_Types, using Type_ID as a FK. a M:M relationship with Recipes, and a M:M relationship with Shopping_Lists
- Recipes: stores the details and instructions of recipes
    - Recipe_ID: int, auto_increment, unique, nn, pk
    - Name: varchar, nn
    - Instructions: text, nn
    - Description: text
    - Relationship: a M:M relationship with Items_In_House
- Ingredients: acts as the intermediary for the M:M relationship of Item_In_House and Recipes
    - Primary Key: itemID + recipeID
    - Item_ID: int, fk
    - Recipe_ID: int, fk
- Shopping_Lists: stores the details on what items need to be purchased
    - Shopping_List_ID: int, auto_increment, unique, nn, pk
    - Name: varchar, nn
    - Relationship: a M:M relationship with Items_In_House
- Items_Needed: acts as the intermediary for the M:M relationship of Items_In_House and Shopping_Lists
    - Primary Key: Item_ID + Shopping_List_ID
    - Item_ID: int, fk
    - Shopping_List_ID: int, fk
    - Quantity: int, nn; this should be the quantity needed


## Citations
All code is based on the OSU CS340 eCampus Node.js Starter App Guide\
Repo: https://github.com/osu-cs340-ecampus/nodejs-starter-app