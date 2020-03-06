const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const KEYS = require('./Keys')

const app = express();

module.exports = {
    config: () => {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(helmet());
    },
    start: () => {
        app.listen(KEYS.PORT, () => {
            console.log(`Server Running on port ${KEYS.PORT}`);
            mongoose.connect(KEYS.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
                .then(() => console.log('Database Running'))
                .catch(err => console.log('DB Error: ', err.message));
        });
    },
    routes: () => {

        // app.use('/ticket', require('./routes/ticket'));
    }
}





