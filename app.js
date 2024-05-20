const express = require('express');
const mongoose = require('mongoose');
const app = express();
const routes = require('./routes/index');
require('dotenv').config()



const dbUrl = process.env.MONGODB_URI;


mongoose.connect(dbUrl, {

}).then(() => {
  console.log('Connected to database');
}).catch(err => {
  console.error(`Error connecting to the database. \n${err}`);
});

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
