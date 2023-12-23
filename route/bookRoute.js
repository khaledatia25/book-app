const express = require('express');
const bookController = require('../controller/bookController');
const router = express.Router();

router.get('/books',bookController.getBookList);
router.get('/books/details/:id',bookController.getBookDetails);
router.post('/books/save',bookController.saveBook);
router.put('/books/update/:id',bookController.updateBook);
router.delete('/books/delete/:id',bookController.deleteBook);

module.exports = router;