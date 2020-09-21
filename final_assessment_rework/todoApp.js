//todoApp.js

//Todo App consists of Todo Manager and Todo List

function isValidTodo(obj) {
  let props = ["title", "month", "year", "id", "completed", "isWithinMonthYear"];
  return obj !== undefined && containsProps(obj, props);
}

function isValidNewTodo(obj) {
  let props = ["title"];
  return obj !== undefined && containsProps(obj, props);
}

function containsProps(obj, props) {
  return props.every(prop => {
    return obj[prop] !== undefined && obj[prop] !== '';
  });
}

function isObject(obj) {
  return obj !== undefined && toString.call(obj) === '[object Object]';
}

function objCopy(obj) { return Object.create(obj) };

//Todo Object requirements
//contain ONLY the following properties and shared methods:
//properties: id (unique), title, completed, month, year, description
//methods: isWithinMonthYear(month, year)
//id and completed not provided by initial todo data, unique id given upon creation
//and completed initially set to false
let Todo = {
  title: '',
  id: '',
  month: '',
  year: '',
  description: '',
  
  completed: false,

  isWithinMonthYear(month, year) {
    return this.month === month && this.year === year;
  },

  init(objData, id) {
    let currentDate = new Date();
    this.title = objData.title;
    this.month = objData.month === '' ? 
                       `${currentDate.getMonth() + 1}` : objData.month;
    this.year = objData.year === '' ?
                      `${currentDate.getFullYear()}` : objData.year;
    this.id = id;
    this.description = objData.description;
    return this;
  }
};


//TodoList
//collection of todo objects
//add a todo to collection
//delete a todo from collection
//initialize collection with n number of todos
//update properties of specific todo object
//return todo based on id
let todoList = function() {
  let id, todos;
  
  return {
    init: function(todoSet) {
      id = 1;
      todos = [];

      for (let idx = 0; idx < todoSet.length; idx += 1) {
        this.add(todoSet[idx]);
      }

      return this;
    },

    add: function(obj) {
      if (!(isValidNewTodo(obj))) return this.errorMsg();

      let newTodo = Object.create(Todo).init(obj, id);
      
      todos.push(newTodo);
      id ++;

      return objCopy(newTodo);
    },

    delete: function(id) {
      let idx, removeObj;

      if (id === undefined) return this.errorMsg("Invalid id");
      idx = this.findTodoIdx(id);

      if (idx === -1) {
        return this.errorMsg("Invalid id");
      } else {
        removeObj = todos.splice(idx, 1)[0];
        return objCopy(removeObj);
      }
    },

    update: function(obj) {
      let idx, updateObj;

      if (!(isValidTodo(obj))) return this.errorMsg();
      idx = this.findTodoIdx(obj.id);
      
      if (idx === -1) {
        return this.errorMsg();
      } else {
        updateObj = todos[idx];
        Object.assign(updateObj, obj);
        return objCopy(updateObj);
      }
    },

    findTodoIdx: function(id) {
      return todos.findIndex(todo => {
        return todo.id === id;
      });
    },

    findTodoByID: function(id) {
      let idx;

      if (id === undefined) return this.errorMsg();
      idx = this.findTodoIdx(id);

      return idx !== -1 ? objCopy(todos[idx]) : this.errorMsg("Invalid id");
    },

    errorMsg: function(msg = "Invalid Input") {
      return { msg };
    },

    getAllTodos: function() {
      let results = [];

      todos.forEach(todo => results.push(objCopy(todo)));

      return results;
    },

  };
  
}();

//TodoManager
//return all todo objects
//return all completed todo objects
//return all todo objects within a given month-year combination
//return all completed todo objects within a given month-year combination
let todoManager = function() {
  return {
    init: function(list) {
      this.todoList = list;
      return this;
    },

    getAllTodos: function() {
      return this.todoList.getAllTodos();
    },

    getAllComplete: function() {
      return this.todoList.getAllTodos().filter(todo => {
        return todo.completed;
      });
    },

    getAllWithinTime: function(month, year) {
      return this.todoList.getAllTodos().filter(todo => {
        return todo.isWithinMonthYear(month, year);
      });
    },

    getAllCompleteWithinTime: function(month, year) {
      return this.todoList.getAllTodos().filter(todo => {
        return todo.isWithinMonthYear(month, year) && todo.completed;
      });
    }
  }
}();

//SAMPLE DATA
const todoData1 = {
  title: 'Buy Milk',
  month: '1',
  year: '2017',
  description: 'Milk for baby',
};

const todoData2 = {
  title: 'Buy Apples',
  month: '',
  year: '2017',
  description: 'An apple a day keeps the doctor away',
};

const todoData3 = {
  title: 'Buy chocolate',
  month: '1',
  year: '',
  description: 'For the cheat day',
};

const todoData4 = {
  title: 'Buy Veggies',
  month: '',
  year: '',
  description: 'For the daily fiber needs',
};

const todoData5 = {
  title: 'Buy Cookies',
  month: '',
  year: '',
  description: '',
};

const todoSet = [todoData1, todoData2, todoData3, todoData4, todoData5];

////////////////TESTING/////////////////////
var $ol = document.querySelector("ol");

function outputResult(message) {
  var $li = document.createElement("li");
  $li.innerText = message;
  $ol.appendChild($li);
  return $li;
}

function test(message, assertion) {
  var $msg = outputResult(message),
      passed = false;

  try {
    passed = assertion();
  }
  catch (e) {
    passed = false;
  }
  $msg.setAttribute("class", passed ? "pass" : "fail");
}

function objsEqual(obj1, objCopy) {
  let [keys1, keys2] = [Object.keys(obj1), Object.keys(Object.getPrototypeOf(objCopy))];
  return keys1.length === keys2.length && keys1.every(key => keys2.includes(key));
}

function objPropsMatch(expected, result) {
  return Object.keys(expected).every(key => result[key] === expected[key]);
}

function arrEqual(arr1, arr2) {
  return arr1.length === arr2.length &&
         arr1.every(val => arr2.includes(val));
}

function copyTodoDataSet() {
  let todoSetCopy = [];

  todoSet.forEach(todoData => todoSetCopy.push(Object.assign({}, todoData)));

  return todoSetCopy;
}

function setUp() {
  todoList.init(0, []);
  todoManager.init(todoList);
}

function setupWithCompleteDataSet() {
  let todoSetCopy = copyTodoDataSet();

  todoList.init(todoSetCopy);

  return todoSetCopy;
}

//TESTING HELPER FUNCTIONS
///////////////////////////////////////

test("testing Todo object is defined", function() {
  return typeof Todo === "object";
});

test("testing creating new Todo using valid input with all properties defined", function() {
  let testObj = Object.create(Todo).init(todoData1, 1); // all fields filled
  let compareObj = Object.assign({}, todoData1);
  compareObj.id = 1;
  compareObj.completed = false;
  
  return objPropsMatch(testObj, compareObj); 
});

test("testing creating new Todo using missing properties", function() {
  let testObj = Object.create(Todo).init(todoData5, 1); //empty except for title
  let compareObj = Object.assign({}, todoData5);
  let currentDate = new Date();

  compareObj.completed = false;
  compareObj.id = 1;
  compareObj.month = String(currentDate.getMonth() + 1);
  compareObj.year = String(currentDate.getFullYear());

  return objPropsMatch(compareObj, testObj); 
});

test("testing isValidTodo is defined", function() {
  return typeof isValidTodo === "function";
});

test("testing valid todo", function() {
  let testObj = Object.create(Todo).init(todoData2, 1);
  return isValidTodo(testObj) === true;
});

test("testing invalid todo", function() {
  let testObj = {
    title: ''
  };

  return isValidTodo(testObj) === false;
});

test("testing isValidNewTodo is defined", function() {
  return typeof isValidNewTodo === "function";
});

test("testing isValidNewTodo with valid input", function() {
  let testObj = Object.assign({}, todoData1);
  return isValidNewTodo(testObj) === true;
});

test("testing isValidNewTodo with invalid (empty string title) input", function() {
  let testObj = {
    title: ''
  };

  return isValidNewTodo(testObj) === false;
});

test("testing isObject is defined", function() {
  return typeof isObject === "function";
});

test("testing isObject is with valid object", function() {
  return isObject({}) === true;
});

test("testing isObject is with invalid object", function() {
  return isObject('') === false;
});

test("testing objCopy is defined", function() {
  return typeof objCopy === "function";
});

test("testing objCopy with test object", function() {
  let testObj = Object.create(Todo).init(todoData1, 1);
  let testCopy = objCopy(testObj);

  return testCopy !== testObj && objsEqual(testObj, testCopy);
});

//TESTING TODOLIST
/////////////////////////////////////
test("testing todoList is defined", function() {
  return todoList !== undefined;
});

//todoList.init
test("testing todoList.init is defined", function() {
  return typeof todoList.init === "function";
});

test("testing todoList intialize with no items", function() {
  todoList.init([]);
  return todoList.getAllTodos().length === 0;
});

test("testing todoList intialize with 1 item", function() {
  todoList.init([todoData1]);
  return todoList.getAllTodos().length === 1;
});

test("testing todoList intialize with 5 items", function() {
  let todoSetCopy = copyTodoDataSet();

  todoList.init(todoSetCopy);
  return todoList.getAllTodos().length === todoSetCopy.length;
});

test("testing todoList initialize with 5 items and each has unique id", function() {
  let todoSetCopy = copyTodoDataSet();
  let ids = [1, 2, 3, 4, 5];
  let setIds = [];

  todoList.init(todoSetCopy);
  
  todoList.getAllTodos().forEach(todo => {
    setIds.push(todo.id);
  });

  return arrEqual(ids, setIds);
});

//todoList.findTodoByID
test("testing todoList.findTodoByID is defined", function() {
  return typeof todoList.findTodoByID === "function";
});

test("testing todoList initialize with 1 item and find todo by id 1", function() {
  let result;

  todoList.init([todoData1]);
  result = todoList.findTodoByID(1);

  return result.id === 1;
});

test("testing todoList initialize with 1 item and find todo by id 14", function() {
  let testObj = Object.assign({}, todoData1);
  let result;

  todoList.init([testObj]);
  result = todoList.findTodoByID(14);

  return result.msg === 'Invalid id';
});

//todoList.getAllTodos
test("testing todoList.getAllTodos is defined", function() {
  return typeof todoList.getAllTodos === "function";
});

test("testing todoList.getAllTodos with 1 item", function() {
  let testObj = Object.assign({}, todoData1);
  let result;

  todoList.init([testObj]);
  result = todoList.getAllTodos();

  return result.length === 1;
});

//todoList.add
test("testing todoList.add is defined", function() {
  return typeof todoList.add === "function";
});

test("testing todoList use add function to add valid todo", function() {
  todoList.init([todoData1]);
  todoList.add(todoData2);
  
  return todoList.getAllTodos().length === 2;
});

test("testing todoList use add function with invalid ({}) todo", function() {
  todoList.init([todoData1]);
  result = todoList.add({});
  
  return result.msg === "Invalid Input" && todoList.getAllTodos().length === 1;
});

test("testing todoList use add function with invalid (undefined) todo", function() {
  todoList.init([todoData1]);
  result = todoList.add();
  
  return result.msg === "Invalid Input" && todoList.getAllTodos().length === 1;
});

//todoList.delete
test("testing todoList.delete is defined", function() {
  return typeof todoList.delete === "function";
});

test("testing todoList delete todo with valid id", function() {
  let todoSetCopy = copyTodoDataSet();
  let result;

  todoList.init(todoSetCopy);
  result = todoList.delete(1);
  
  return result.id === 1 && 
         todoList.getAllTodos().length == todoSetCopy.length - 1;
});

test("testing todoList delete todo with invalid id", function() {
  let todoSetCopy = copyTodoDataSet();
  let result;

  todoList.init(todoSetCopy);
  result = todoList.delete(12);
  
  return result.msg === 'Invalid id' && 
         todoList.getAllTodos().length == todoSetCopy.length;
});

//todoList.update
test("testing todoList.update is defined", function() {
  return typeof todoList.update === "function";
});

test("testing todoList update with valid input", function() {
  let todoSetCopy = copyTodoDataSet();
  let updateData = {title: 'Finishing Test', month: '1', year: '2020', description: 'yikes!'};
  let updateObj = Object.create(Todo).init(updateData, 1);
  let result;

  todoList.init(todoSetCopy);
  result = todoList.update(updateObj);

  return objPropsMatch(result, updateObj);
});

test("testing todoList update with invalid input (empty string title)", function() {
  let todoSetCopy = copyTodoDataSet();
  let updateData = {title: '', month: '1', year: '2020', description: 'yikes!'};
  let updateObj = Object.create(Todo).init(updateData, 1);
  let result;

  todoList.init(todoSetCopy);
  result = todoList.update(updateObj);

  return !(objPropsMatch(result, updateObj)) && result.msg === 'Invalid Input';
});

////TESTING TODOMANAGER 
///////////////////////////////////
test("testing todoManager is defined", function() {
  return todoManager !== undefined;
});

//todoManager.init
test("testing todoManager.init is defined", function() {
  return typeof todoManager.init === "function";
});

test("testing TodoManager intialize with data set", function() {
  let todoSetCopy = copyTodoDataSet();
  let result;

  todoList.init(todoSetCopy);
  result = todoManager.init(todoList);

  return result === todoManager;
});

//todoManager.getAllTodos
test("testing todoManager.getAllTodos is defined", function() {
  return typeof todoManager.getAllTodos === "function";
});

test("testing TodoManager getAllTodos with full data set", function() {
  let todoSetCopy = copyTodoDataSet();
  let result;

  todoList.init(todoSetCopy);
  todoManager.init(todoList);
  result = todoManager.getAllTodos();

  return result.length === todoSetCopy.length;
});

//todoManager.getAllComplete
test("testing todoManager.getAllComplete is defined", function() {
  return typeof todoManager.getAllComplete === "function";
});

test("testing TodoManager getAllComplete with 2 completed todos", function() {
  let todoSetCopy = copyTodoDataSet();
  let completeObj1, completeObj2, result;

  todoList.init(todoSetCopy);
  todoManager.init(todoList);

  completeObj1 = todoList.findTodoByID(1);
  completeObj2 = todoList.findTodoByID(2);

  [completeObj1, completeObj2].forEach(obj => {
    obj.completed = true;
    todoList.update(obj);
  });

  result = todoManager.getAllComplete();

  return result.length === 2;
});

//todoManager.getAllWithinTime
test("testing todoManager.getAllWithinTime is defined", function() {
  return typeof todoManager.getAllWithinTime === "function";
});

test("testing TodoManager getAllWithinTime 1 2016", function() {
  let testObj1 = Object.assign({}, todoData1);
  let testObj2 = Object.assign({}, todoData2);
  let result;

  [testObj1, testObj2].forEach(obj => {
    obj.month = '1';
    obj.year = '2016';
  });
  
  todoList.init([testObj1, testObj2]);
  todoManager.init(todoList);
  result = todoManager.getAllWithinTime('1', '2016');

  return result.length === 2;
});

//todoManager.getALlCompleteWithinTime
test("testing todoManager.getAllCompleteWithinTime is defined", function() {
  return typeof todoManager.getAllCompleteWithinTime === "function";
});

test("testing TodoManager getAllCompleteWithinTime 1 2016", function() {
  let testObj1 = Object.assign({}, todoData1);
  let testObj2 = Object.assign({}, todoData2);
  let result, updateObj;

  [testObj1, testObj2].forEach(obj => {
    obj.month = '1';
    obj.year = '2016';
  });
  
  todoList.init([testObj1, testObj2]);
  todoManager.init(todoList);

  updateObj = todoList.findTodoByID(1);
  updateObj.completed = true;

  todoList.update(updateObj);
  result = todoManager.getAllCompleteWithinTime('1', '2016');
  
  return result.length === 1;
});









