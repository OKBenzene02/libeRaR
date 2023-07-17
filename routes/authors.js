const { Router } = require("express");
const Author = require('../models/author')

const express = require('express');
const author = require("../models/author");
const router = express.Router();

// Route for All Authors
router.get('/', async (req, response) => {
    let searchAuthor = {};
    if (req.query.name !== null && req.query.name !== ''){
        searchAuthor.name = new RegExp(req.query.name, 'i')
    }

    try {
        const authors = await Author.find(searchAuthor)
        response.render('authors/index', { authors: authors, 
            searchAuthor: req.query });
    }
    catch {
        response.redirect('/')
    }


})

// Route for New Authors
router.get('/new', (req, response) => {
    response.render('authors/new', { author: new Author() });
})

// Route for Author Route
router.post('/', async (req, response) =>{
    const author = new Author({
        name: req.body.name,
    })

    try {  
        const newAuthor = await author.save();
        // response.redirect(`books/${newBook.id}`)
        response.redirect('authors')
    }
    catch{  
        response.render('authors/new', {
            author: author,
            errMessage: "Error creating Author"
        })
    }
})

module.exports = router