const Joi = require('joi');
const express = require('express');
const app = express();

// This is for enabling json parsing in the request body.
app.use(express.json());

const books = [
    {id: 1, name: "Harry Potter and the Order of the Phoenix", author: "JK Rowling"},
    {id: 2, name: "Words of Radiance", author: "Brandon Sanderson"}
];

app.get('/',  (req, res) => {
    res.send('Hello World');
});

app.get('/api/books', (req, res) => {
    res.send(books);
});

app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        res.status(404).send(`Book with id ${req.params.id} not found!`);
        return;
    }
    res.send(book);
});

app.post('/api/books', (req, res) => {
    const book = {
        id: books.length + 1,
        name: req.body.name,
        author: req.body.author    
    };

    // Validate input
    const result = validateBook(req.body);
    if (result.error) {
        const message = result.error.message;
        res.status(400).send(message);
        return;
    }   

    books.push(book);
    res.status(201).send(book); // The client might need to know the result of the post request.
});

app.put('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        res.status(404).send(`Book with id ${req.params.id} not found!`);
        return;
    }

    //Validate the new book
    const result = validateBook(req.body);
    if (result.error) {
        const message = result.error.message;
        res.status(400).send(message);
        return;
    }  

    //Update the book
    book.name = req.body.name;
    book.author = req.body.author;

    res.send(book);
});

app.delete('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        res.status(404).send(`Book with id ${req.params.id} not found!`);
        return;
    }

    const index = books.indexOf(book);
    books.splice(index, 1);

    res.send(books);
});

function validateBook(book) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).required(),
        author: Joi.string().min(3).required()
    });

    const result = Joi.validate(book, schema);
    return result;
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));