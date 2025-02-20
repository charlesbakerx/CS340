# Document Improvements
- [ ] Separate sections for actions taken and not taken after each step in addition to the verbatim feedback from the step, even if we used all suggestions. ; Quinn Downey

# HTML Improvements
## Household Inventory / Home Page
- [ ] Item_ID is missing from the table, Type_ID is possibly supposed to be Item_ID making Type_ID the actual missing field. ;Quinn Downey
- [ ] Displays Type_ID instead of name ;Quinn Downey

## Recipes Page
- [ ] Table headers for Description and Instructions seem to be swapped ;Quinn Downey
- [ ] The update and add forms do not have appropriate fields to update/add to the table. ;Quinn Downey

## Ingredients Page
- [ ] The update and add forms do not have appropriate fields to update/add to the table. ;Quinn Downey

## Shopping Lists Page
- [ ] The Add form has the title "Add Item a different Shopping List" ;Quinn Downey

# DML Improvements
- [x] SELECT queries will need to be updated to utilize a JOIN to provide relevant names to IDs. ;Quinn Downey
- [ ] DELETE anomaly deleting and item from Items_In_House also deletes in Items_Needed and Ingredients. ; Gregory Preiss
This anomaly is due to the fact that Rows are added to both Items_Needed and Ingredients based on the item already being present in the Items_In_House table. We will have to either not use a delete statement on Items_In_House and instead just set the quantity to zero or rework how the database to have a separate Items and Items_In_House table with the Items_Needed and Items_In_House tables referencing the new Items table.
