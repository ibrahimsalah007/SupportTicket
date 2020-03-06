const express = require('express');

const router = express.Router();

router.get('/', require('../Controller/Ticket').getTickets);

module.exports = router;