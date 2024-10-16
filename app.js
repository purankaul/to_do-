const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const db = require(__dirname + '/database.js'); 

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  const day = date.getDate();

  db.all("SELECT * FROM tasks WHERE category = 'default'", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    
    res.render("list", {
      listTitle: day,
      listItems: rows.map(row => row.task) 
    });
  });
});

app.get("/work", function(req, res){
  db.all("SELECT * FROM tasks WHERE category = 'work'", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    res.render("list", {
      listTitle: "Work List",
      listItems: rows.map(row => row.task)  
    });
  });
});


app.post("/", function(req, res) {
  const newTask = req.body.newTodo;
  const listType = req.body.listSubmit === "Work" ? "work" : "default";

  db.run("INSERT INTO tasks (task, category) VALUES (?, ?)", [newTask, listType], (err) => {
    if (err) {
      console.error(err);
      return;
    }

    if (listType === "work") {
      res.redirect("/work");
    } else {
      res.redirect("/");
    }
  });
});

app.post("/delete", function(req, res) {
    const taskId = req.body.taskId;
  
    // Delete the task from the database using the taskId
    db.run("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
      if (err) {
        console.error(err);
        return;
      }
  
      res.redirect("/");  // Redirect to the home page or work page
    });
  });
  
app.listen(3000, function() {
  console.log("Server running on port 3000.");
});
