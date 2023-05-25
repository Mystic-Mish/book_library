//Book class: represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class: handles UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#booklist');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.title}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        
        const container = document.querySelector('.container');
        const form = document.querySelector('#library');
        container.insertBefore(div, form);

        //Alert disappearance
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
}

//Store class: handles storage
class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: add a book
document.querySelector('#library').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validation
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields.');
    } else {
        //Instantiate book
        const book = new Book(title, author, isbn);

        //Add book to UI
        UI.addBookToList(book);

        //Add book to local storage
        Store.addBook(book);

        //Show book has been added successfully
        UI.showAlert('Book added successfully.');

        //Clear fields
        UI.clearFields();
    }
});

//Event: remove a book
document.querySelector('#booklist').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show book has been deleted successfully
    UI.showAlert('Book deleted successfully.');

});