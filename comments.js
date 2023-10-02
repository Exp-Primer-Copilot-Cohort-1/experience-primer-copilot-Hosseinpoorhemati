// create web server with express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// import cors
const cors = require('cors');
// import mongoose
const mongoose = require('mongoose');
// import body-parser
const bodyParser = require('body-parser');
// import routes
const comments = require('./routes/comments');
// import database
const db = require('./config/database');
// import error handler
const errorHandler = require('./middleware/errorHandler');

// connect to database
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// set up cors
app.use(cors());

// set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set up routes
app.use('/comments', comments);

// set up error handler
app.use(errorHandler);

// start server
app.listen(port, () => console.log(`Server started on port ${port}`));

