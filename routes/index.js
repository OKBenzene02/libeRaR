const { Router } = require("express");

const express = require('express');
const router = express.Router();

router.get('/', (req, response) => {
    response.render('index');
})

module.exports = router