const books = [];
const RENDER_EVENT = 'render=book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF';

inputBookIsComplete.addEventListener('change', function () {
    const bookSubmit = document.querySelector('#bookSubmit>span')
    if (inputBookIsComplete.checked) {
        bookSubmit.innerText = 'Sudah Selesai Dibaca'
    } else {
        bookSubmit.innerText = 'Belum Selesai Dibaca'
    }
})

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('uncompleteBook');
    const listCompleted = document.getElementById('completeBook');

    uncompletedBookList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted === true) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser anda tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveBookData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadBookFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}



function makeBook(bookObject) {
    const {
        id,
        title,
        author,
        year,
        isCompleted
    } = bookObject;

    const bookTitle = document.createElement('div');
    bookTitle.classList.add('BookTitle');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('div');
    bookAuthor.classList.add('BookAuthor');
    bookAuthor.innerText = author;

    const bookYear = document.createElement('div');
    bookYear.classList.add('year');
    bookYear.innerText = year;

    const detailBook = document.createElement('div');
    detailBook.classList.add('detailBook');
    detailBook.append(bookTitle, bookAuthor, bookYear);

    const deleteIcon = document.createElement('div');
    deleteIcon.innerText = 'Delete';

    const checklistIcon = document.createElement('div');
    checklistIcon.innerText = 'Selesai Dibaca';

    const doubleChecklist = document.createElement('div');
    doubleChecklist.innerText = 'Belum Selesai';

    const bookCard = document.createElement('div');
    bookCard.classList.add('Book', 'shadow')
    bookCard.append(detailBook);
    bookCard.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        const doubleChecklistButton = document.createElement('button');
        doubleChecklistButton.setAttribute('id', `checklist`);
        doubleChecklistButton.append(doubleChecklist);
        doubleChecklistButton.addEventListener('click', function () {
            undoBookFromCompleted(id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('id', `delete`);
        deleteButton.append(deleteIcon);
        deleteButton.addEventListener('click', function () {
            removeBook(id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('actionButton');
        actionButton.append(doubleChecklistButton, deleteButton);

        bookCard.append(actionButton);
    } else {
        const checklistButton = document.createElement('button');
        checklistButton.setAttribute('id', `checklist`);
        checklistButton.append(checklistIcon);
        checklistButton.addEventListener('click', function () {
            addBookToCompleted(id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('id', `delete`);
        deleteButton.append(deleteIcon);
        deleteButton.addEventListener('click', function () {
            removeBook(id);
        });
        const actionButton = document.createElement('div');
        actionButton.classList.add('actionButton');
        actionButton.append(checklistButton, deleteButton);

        bookCard.append(actionButton);
    }
    return bookCard;
}

function bookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function clearInput() {
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
};
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const bookTitle = document.getElementById("inputBookTitle").value
        const bookAuthor = document.getElementById("inputBookAuthor").value
        const bookYear = document.getElementById("inputBookYear").value
        const bookIsCompleted = document.getElementById("inputBookIsComplete").checked

        const newBook = {
            id: +new Date(),
            title: bookTitle,
            author: bookAuthor,
            year: parseInt(bookYear),
            isComplete: bookIsCompleted

        }
        if (typeof Storage !== undefined) {
            const bookObj = bookObject(newBook.id, newBook.title, newBook.author, newBook.year, newBook.isComplete);
            books.push(bookObj);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveBookData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
            alert('Buku Berhasil Ditambahkan');
        } else {
            alert('Browser anda tidak mendukung Web Storage');
        }
        clearInput();
    });
    if (isStorageExist()) {
        loadBookFromStorage();
    }

});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan')
})


searchSubmit.innerText = "Cari";
searchSubmit.addEventListener("click", function (event) {
    event.preventDefault();

    const searchTitle = document.querySelector("#searchTitle");
    const searchResult = document.querySelector('#search > .BookCard');

    searchResult.innerHTML = '';
    searchResult.innerHTML += `<p>Hasil pencarian judul buku <b>${searchTitle.value}</b></p>`;

    for (const bookItem of books) {
        if (bookItem.title.toLowerCase().includes(searchTitle.value.toLowerCase())) {
            if (bookItem.isCompleted === true) {

                const bookTitle = document.createElement('div');
                bookTitle.classList.add('bookTitle');
                bookTitle.innerText = bookItem.title;

                const bookAuthor = document.createElement('div');
                bookAuthor.classList.add('bookAuthor');
                bookAuthor.innerText = bookItem.author;

                const bookStatus = document.createElement('div');
                bookStatus.classList.add('status', 'Complete')
                bookStatus.innerText = 'Selesai Dibaca';

                const bookDetail = document.createElement('div');
                bookDetail.classList.add('bookDetail');
                bookDetail.append(bookTitle, bookAuthor, bookStatus);

                const iconDelete = document.createElement('div');
                iconDelete.innerText = "Hapus";

                const doubleChecklist = document.createElement('div');
                doubleChecklist.innerText = "Belum Selesai";

                const doubleChecklistButton = document.createElement('button');
                doubleChecklistButton.setAttribute('id', `checklist`);
                doubleChecklistButton.append(doubleChecklist);
                doubleChecklistButton.addEventListener('click', function () {
                    undoBookFromCompleted(bookItem.id);
                });

                const deleteButton = document.createElement('button');
                deleteButton.setAttribute('id', `delete`);
                deleteButton.append(iconDelete);
                deleteButton.addEventListener('click', function () {
                    removeBook(bookItem.id);
                });

                const actionButton = document.createElement('div');
                actionButton.classList.add('actionButton');
                actionButton.append(doubleChecklistButton, deleteButton);

                const bookCard = document.createElement('div');
                bookCard.classList.add('Book', 'shadow')
                bookCard.append(bookDetail, actionButton);

                searchResult.append(bookCard);
            } else {
                const bookTitle = document.createElement('div');
                bookTitle.classList.add('bookTitle');
                bookTitle.innerText = bookItem.title;

                const bookAuthor = document.createElement('div');
                bookAuthor.classList.add('BookAuthor');
                bookAuthor.innerText = bookItem.author;

                const bookStatus = document.createElement('div');
                bookStatus.classList.add('status', 'Incomplete')
                bookStatus.innerText = 'Belum Selesai'

                const detailBook = document.createElement('div');
                detailBook.classList.add('detailBook');
                detailBook.append(bookTitle, bookAuthor, bookStatus);

                const deleteIcon = document.createElement('div');
                deleteIcon.innerText = "Hapus";

                const checklistIcon = document.createElement('div');
                checklistIcon.innerText = "Selesai Dibaca";

                const checklistButton = document.createElement('button');
                checklistButton.setAttribute('id', `checklist`);
                checklistButton.append(checklistIcon);
                checklistButton.addEventListener('click', function () {
                    addBookToCompleted(bookItem.id);
                });

                const deleteButton = document.createElement('button');
                deleteButton.setAttribute('id', `delete`);
                deleteButton.append(deleteIcon);
                deleteButton.addEventListener('click', function () {
                    removeBook(bookItem.id);
                });

                const actionButton = document.createElement('div');
                actionButton.classList.add('actionButton');
                actionButton.append(checklistButton, deleteButton);

                const bookCard = document.createElement('div');
                bookCard.classList.add('Book', 'shadow')
                bookCard.append(detailBook, actionButton);

                searchResult.append(bookCard);
            }
        }
    }
});

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
}


function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function findBookTitle(bookTitle) {
    for (const Booktitle in books) {
        if (Booktitle.title === bookTitle) {
            return Booktitle;
        }
    }
    return 1;
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
    alert('Buku berhasil dihapus dari daftar')
};

function undoBookFromCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
}