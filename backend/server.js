require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

// --- UPDATE CORS CONFIGURATION HERE ---
const corsOptions = {
  // Use the URL from .env, or fallback to your local Vite URL
  origin: process.env.CLIENT_URL || 'http://localhost:5173' || "http://localhost:4173", 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Only allow these HTTP methods
  credentials: true // Required if you are using cookies/sessions (good for future-proofing)
};

app.use(cors(corsOptions));
// ------------------------------------

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/task-pwa')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// CRUD Routes
// app.get('/api/tasks', async (req, res) => {
//   const tasks = await Task.find().sort({ createdAt: -1 });
//   res.json(tasks);
// });

app.get('/api/tasks', async (req, res) => {
  try {
    // Get page from URL, default to 1. Set limit to 5 tasks per page.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    
    // Calculate how many items to skip
    const skip = (page - 1) * limit;

    // Get total count for frontend math
    const totalTasks = await Task.countDocuments();
    
    // Fetch the specific page of tasks
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Send back the tasks AND the pagination data
    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// DELETE ALL route
app.delete('/api/tasks', async (req, res) => {
  await Task.deleteMany({});
  res.json({ message: 'All tasks deleted successfully' });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));