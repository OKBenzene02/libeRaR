if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express(); 
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');

const bodyparser = require('body-parser');

// Connection with mongoDB database
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to mongoose'));

// Static Express JS files should be included when creating a new application
app.set('view engine', 'ejs');
app.set("views", __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.use(bodyparser.urlencoded({ limit: '10mb', extended: false }))
app.use('/', indexRouter);
app.use('/authors', authorRouter);


app.listen(process.env.PORT || 3000);
