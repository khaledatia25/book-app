const queries = require('../db/quiries');
const dbConnection = require('../db/connection');
const util = require('../util/utility');
const Logger = require('../services/loggerService');
const auditService = require('../audit/auditService');
const auditAction = require('../audit/auditActions');

const logger = new Logger('bookController');

exports.getBookList = async (req, res) => {
    try{
        const BookListQuery = queries.queryList.GET_BOOK_LIST_QUERY;
        const result = await dbConnection.query(BookListQuery);
        logger.info("return book list", result.rows);
        auditService.prepareAduit(auditAction.auditAction.GET_BOOK_LIST, result.rows, null, "postman", util.dateFormat());
        return res.status(200).send(JSON.stringify(result.rows));
    }catch(e){
        console.log(e);
        auditService.prepareAduit(auditAction.auditAction.GET_BOOK_LIST, null, JSON.stringify({e}), "postman", util.dateFormat());
        return res.status(500).send({error: 'Failed to list Books'});
    }
}

exports.getBookDetails = async (req, res) => {
    try{
        const bookId = req.params.id;
        const BookDetailsQuery = queries.queryList.GET_BOOK_DETAILS_QUERY;
        const result = await dbConnection.query(BookDetailsQuery,[bookId]);
        return res.status(200).send(JSON.stringify(result.rows[0]));
    }catch(e){
        console.log(e);
        return res.status(500).send({error: 'Failed to list Book Details'});
    }
}

exports.saveBook = async (req, res) => {
    try {
        const createdBy = 'admin';
        const createdOn = new Date();
        
        const title = req.body.title;
        const description = req.body.description;
        const author = req.body.author;
        const publisher = req.body.publisher;
        const pages = req.body.pages;
        const storeCode = req.body.storeCode;
        if(!title||!author || !storeCode || !publisher){
            return res.status(500).send({error: 'title, author, storeCode, publisher must be provided'});
        }
        const values = [title, description, author, publisher, pages, storeCode, createdBy, createdOn];
        const saveBookQuery = queries.queryList.SAVE_BOOK_QUERY;
        await dbConnection.query(saveBookQuery, values);
        return res.status(201).send('Book Added Successfully.');
    }catch(e){
        console.log(e);
        return res.status(500).send({error: 'Failed to Add Book'});
    }

}

exports.updateBook = async (req, res) => {
    try {
        
        const createdBy = 'admin';
        const createdOn = new Date();

        const bookId = req.params.id;
        const title = req.body.title;
        const description = req.body.description;
        const author = req.body.author;
        const publisher = req.body.publisher;
        const pages = req.body.pages;
        const storeCode = req.body.storeCode;
        if(!bookId||!title||!author || !storeCode || !publisher){
            return res.status(500).send({error: 'bookId, title, author, storeCode, publisher must be provided'});
        }
        const values = [title, description, author, publisher, pages, storeCode, createdBy, createdOn, bookId];
        const updateBookQuery = queries.queryList.UPDATE_BOOK_QUERY;
        await dbConnection.query(updateBookQuery, values);
        return res.status(201).send('Book Updated Successfully.');
    }catch(e){
        console.log(e);
        return res.status(500).send({error: 'Failed to Update Book'});
    }

}

exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        
        if(!bookId){
            return res.status(500).send({error: 'bookId must be provided'});
        }
        const deleteBookQuery = queries.queryList.DELETE_BOOK_QUERY;
        await dbConnection.query(deleteBookQuery, [bookId]);
        return res.status(201).send('Book Deleted Successfully.');
    }catch(e){
        console.log(e);
        return res.status(500).send({error: 'Failed to Delete Book'});
    }

}