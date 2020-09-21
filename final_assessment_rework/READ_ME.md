# Todo App Assessment #
Dorey Miller
created 9/16/2020

## Files Included: ##
todoApp.js
index_todo.html
READ_ME.md

## Project Overview ##
This project includes a working code base for a todo app, as specified in the LS229 assessment instructions, as well as a a custom testing suite.  According to the specifications, I have included the following functionality for this app:

* A `todoList` object that keeps track of a list of all todo items, as well as providing functionality for manipulation of list.

* A `todoManager` object that handles retrieving the data from the todoList.

* A testing suite, at the bottom of the application file (`todoApp.js`), which tests all of the functionality of the todo app.  This testing suite is meant to be used with a browser by opening the file `index_todo.html`.  

## Notes: ##
**Application** - There were a few places that I made assumptions, based on interpreting the requirements and on my own logic.  The first was in defining the `init` function for the `todoList`.  The requirements for this were to "Initializes the collection with `n` number of `todo` objects".  In my interpretation of that requirement, I created a function that takes two arguments: (`n`, `objArr`).  I normally would have only defined this function with the array of todo objects and used the length of that as `n`, but I was trying to match the language of the requirement.  The second assumption is that I allow for empty string descriptions.  I didn't see a description as a necessary component for the todo.  Finally, I realize now as I'm writing this up that I used a factory function for creating todo objects and would have been nicer to stick with OLOO pattern I used for the `todoList` and `todoManager`.  I have run out of time to make that change before submission.

**Testing** - I had wanted to try and get Jest working, but I was running into some troubles and I have not used it before.  I feel like my solution is acceptable, but I plan to try and get Jest working for practice.  It was stated that the testing methods are up to us and could be included within the same file.  I was trying to work with modules, but also got stuck there and decided in the interest of time to make sure I got all of the testing defined in its' current form.