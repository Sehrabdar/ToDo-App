import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const todos = [];
let nextId =1;

app.get('/todos', (req, res) => 
{
     console.log("New Request received.");
     res.json(todos);
});

app.post('/todos', (req, res) => 
{
     const todolist = req.body;
     const addedTodos= todolist.map( todoitem => ({
          id: nextId++,
          task: todoitem.task,
          completed: todoitem.completed
     }));
     todos.push(...addedTodos);
     res.status(200).json(addedTodos);
});

app.put('/todos/:id', (req, res) =>
{
     let Userid = parseInt(req.params.id);
     const todo = todos.find(t => t.id === Userid);
     if(todo){
          todo.task = req.body.task != undefined ? req.body.task : todo.task;
          todo.completed = req.body.completed !=  undefined ? req.body.completed : todo.completed;
          res.json({ message: `User with ID ${Userid} has been updated.`,   todos})
     } else{
          res.json({message: 'todo not found'})
     }
     
});

app.delete('/todos/:id', (req, res) => {
     let Userid = parseInt(req.params.id);
     const index = todos.findIndex(t => t.id === Userid);
     if(index !== -1){
          todos.splice(index,1);
          res.json({message: 'Todo Deleted.'})
     } else{
          res.json({message: 'Todo not found'})
     }
});

const port = 4000;
app.listen(port, () => 
{
console.log(`Server is running! on port ${port}`);
});