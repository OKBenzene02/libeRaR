const { Router } = require("express");
const express = require('express');
const router = express.Router();

const Book = require("../models/book");
const Author = require('../models/author')

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

// Route for All Books
router.get('/', async (req, response) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.lte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        response.render('books/index', {
            books: books,
            searchAuthor: req.query
        });

    } catch {
        response.redirect('/')
    }

})

// Route for New Books
router.get('/new', async (req, response) => {
    renderNewPage(response, new Book())
})

// Route for Book Route
router.post('/', async (req, response) =>{
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate ? new Date(req.body.publishDate) : null,
        pageCount: req.body.pageCount,
        description: req.body.description,
    })

    saveCoverImage(book, req.body.cover);

    try{ 
        const newBook = await book.save();
        // response.redirect(`books/${newBook.id}`)
        response.redirect('books')
    } catch (err){
        console.log(err)
        renderNewPage(response, book, true)
    }

})

// const removeBookCover = (filename) => {
//     fs.unlink(path.join(uploadPath, filename), (err) => {
//         console.log(err) 
//     })
// }


const saveCoverImage = (book, coverEncoded) => {
    if (coverEncoded == null){ return; }
    const cover = JSON.parse(coverEncoded)
    console.log(cover)
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
    // console.log(book.coverImageType, book.coverImage)

}

const renderNewPage = async (response, book, hasErrorMsg = false) => {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasErrorMsg) params.errMessage = 'Error creating Book';
        response.render('books/new', params)
    } catch (err){
        console.log(err)
        response.redirect('/books')
    }
}


module.exports = router