const { Router } = require("express");

const express = require('express');
const router = express.Router();
const Book = require('../models/book')


router.get('/', async (req, response) => {
    let books;
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        books = []
    }
    response.render('index', {
        books: books
    });
})

module.exports = router