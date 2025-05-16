require('dotenv').config();
console.log("DEBUG ENV LOADED:", process.env);
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Appointment = require('./models/Appointment');
const Blog = require('./models/Blog');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Debug print
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Connection error:",err));

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/book', (req, res) => res.render('book'));
app.get('/schedule', (req, res) => res.render('schedule'));
app.get('/blog', async (req, res) => {
  const posts = await Blog.find().sort({ date: -1 });
  res.render('blog', { posts });
});
app.get('/admin', async (req, res) => {
  const appointments = await Appointment.find().sort({ date: 1 });
  res.render('admin', { appointments });
});

app.post('/book', async (req, res) => {
  const { name, email, date, time, message } = req.body;
  const appointment = new Appointment({ name, email, date, time, message });
  await appointment.save();
  res.redirect('/schedule');
});

app.post('/blog', async (req, res) => {
  const { title, content } = req.body;
  const post = new Blog({ title, content });
  await post.save();
  res.redirect('/blog');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
