const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use('/ticket', require('./routes/ticket'));


app.listen(80, ()=>{
    console.log('server is running port 80.' );
    mongoose.connect('mongodb://localhost/Ticket', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(()=>console.log('Database Running'))
    .catch(err => console.log('DB Error: ', err));
})