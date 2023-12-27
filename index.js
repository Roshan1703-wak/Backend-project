const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3022;

app.use(bodyParser.json());


let tasks = [];


const validateTask = (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  next();
};




app.get('/tasks', (req, res) => {
  
  res.status(200).json(tasks);
});

// Retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  res.status(200).json(task);
});

app.post('/tasks', validateTask, (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Update an existing task by ID
app.put('/tasks/:id', validateTask, (req, res) => {
  const taskId = parseInt(req.params.id);

  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks[taskIndex] = {
    id: taskId,
    title: req.body.title,
    description: req.body.description,
  };

  res.status(200).json(tasks[taskIndex]);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);

  tasks = tasks.filter((t) => t.id !== taskId);

  res.status(200).json({ message: 'Task deleted successfully.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error.' });
});


app.get('/employees', async (req, res) => {
  try {
    const response = await axios.get('https://dummy.restapiexample.com/api/v1/employees');
    res.status(200).json(response.data.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch employees.' });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  