// index.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketHandler = require('./socketHandler');

dotenv.config();

// Connect to DB
mongoose.connect('mongodb+srv://moussa:moussa11@cluster0.69vd9yl.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to MongoDB')).catch((err) => console.error('Error connecting to MongoDB', err));

// Middlewares
app.use(express.json());

// Cors Options
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Route Middlewares
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

// Start server
const server = socketHandler(app);
server.listen(4000, () => console.log('Server and Socket.IO are running on port 4000'));






/* const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// // Connect to DB
// mongoose.connect("mongodb+srv://moussa:moussa11@cluster0.69vd9yl.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to MongoDB'))
// .catch((err) => console.error('Error connecting to MongoDB', err));

// // Middlewares
// app.use(express.json());

// // Cors Options
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
//   }));

// // Route Middlewares
// const authRoute = require('./routes/auth');
// const postRoute = require('./routes/posts');
// app.use('/api/user', authRoute);
// app.use('/api/posts', postRoute);

// // Start server
// app.listen(4000, () => console.log('Server up and running'));
// module.exports = app; */
