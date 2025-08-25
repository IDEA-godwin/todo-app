
const Database  = require("better-sqlite3");


let db;

function setupDB(dbName = "todo-db") {
   db = new Database(dbName, {});

   db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
         id INTEGER PRIMARY KEY,
         title TEXT,
         description TEXT,
         completed INTEGER
      )    
   `)
}

function getTodos() {
   const query = db.prepare("SELECT * FROM todos");
   const result = query.all();
   return result
}

function getSingleTodo(id) {
   const query = db.prepare("SELECT * FROM todos WHERE id = ?");
   const result = query.get(id);
   return result
}

function createTodo(title, description) {
   const query = db.prepare("INSERT INTO todos (title, description) VALUES (?, ?)");
   const result = query.run(title, description);
   return result
}

function updateTodo(title, description, completed, id) {
   const query = db.prepare("UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?");
   const result = query.run(title, description, completed, id);
   return result
}

function deleteTodo(id) {
   const query = db.prepare("DELETE FROM todos WHERE id = ?");
   const result = query.run(id);
   return result
}


module.exports = {
   setupDB, getSingleTodo, getTodos,
   updateTodo, deleteTodo, createTodo
}
