let books = [];
const RENDER_EVENT = "render-book";
const localStorageKey = "BooksAreQuietMiracles";
let searchKeyword = "";

if (typeof Storage !== undefined) {
  if (localStorage.getItem(localStorageKey) === null) localStorage.getItem(localStorageKey, 0);
}
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookFormSubmit");

  const parsedData = localStorage.getItem(localStorageKey);

  if (parsedData) {
    books = JSON.parse(parsedData);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));

  submitForm.addEventListener("click", function (event) {
    event.preventDefault();
    addBooks();
    const datas = JSON.stringify(books);
    localStorage.setItem(localStorageKey, datas);
  });
});

function addBooks() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const isCompleted = document.getElementById("bookFormIsComplete").checked;

  const generatedBookID = generatedBookId();
  const booksObject = generatedBookForm(generatedBookID, bookTitle, bookAuthor, Number(bookYear), isCompleted);

  //cek dlu input gak boleh kosong
  if (!bookTitle.trim() || !bookAuthor.trim() || !bookYear) {
    alert("please fill in the form Correctly ");
  } else {
    books.push(booksObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function generatedBookId() {
  return +new Date();
}

function generatedBookForm(generatedBookID, bookTitle, bookAuthor, bookYear, isCompleted) {
  return {
    id: generatedBookID,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    completed: isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBooks = document.getElementById("incompleteBookList");
  uncompleteBooks.innerHTML = "";

  const completedBooks = document.getElementById("completeBookList");
  completedBooks.innerHTML = "";

  for (const booksItem of books) {
    const isMatched = booksItem.title.toLowerCase().includes(searchKeyword);
    if (isMatched) {
      const bookElement = createNewBookList(booksItem);
      if (booksItem.completed === false) {
        uncompleteBooks.append(bookElement);
      } else {
        completedBooks.append(bookElement);
      }
    }
  }
});

function createNewBookList(bookValue) {
  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.classList.add("book-title");
  bookTitle.innerText = bookValue.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.innerText = `Penulis: ${bookValue.author}`;

  const bookYear = document.createElement("p");
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.innerText = `Tahun: ${bookValue.year}`;

  const buttonDelete = document.createElement("button");
  buttonDelete.innerText = "hapus buku";
  buttonDelete.setAttribute("data-testid", "bookItemDeleteButton");
  buttonDelete.addEventListener("click", function (e) {
    e.preventDefault();
    deleteBook(bookValue.id);
  });

  const buttonEdit = document.createElement("button");
  buttonEdit.innerText = "edit buku";
  buttonEdit.setAttribute("data-testid", "bookItemEditButton");
  buttonEdit.addEventListener("click", function (e) {
    e.preventDefault();
    editBook(bookValue.id);
  });

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(bookTitle, bookAuthor, bookYear, buttonDelete, buttonEdit);

  const container = document.createElement("section");
  container.setAttribute("data-bookid", bookValue.id);
  container.setAttribute("data-testid", "bookItem");
  container.append(textContainer);
  container.setAttribute("id", `books-${bookValue.id}`);

  if (bookValue.completed) {
    const buttonComplete = document.createElement("button");
    buttonComplete.innerText = "selesai dibaca";
    buttonComplete.setAttribute("data-testid", "bookItemIsCompleteButton");
    buttonComplete.addEventListener("click", function (e) {
      e.preventDefault();
      inCompletedBooks(bookValue.id);
    });

    container.append(buttonComplete);
  } else {
    const buttoninComplete = document.createElement("button");
    buttoninComplete.innerText = "belum selesai dibaca";
    buttoninComplete.setAttribute("data-testid", "bookItemIsCompleteButton");
    buttoninComplete.addEventListener("click", function (e) {
      e.preventDefault();
      completedBooks(bookValue.id);
    });

    container.append(buttoninComplete);
  }

  return container;
}

function completedBooks(bookId) {
  const bookTarget = findBookId(bookId);

  if (bookTarget === null) return;

  bookTarget.completed = true;
  localStorage.setItem(localStorageKey, JSON.stringify(books));

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookId(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
}

function inCompletedBooks(bookId) {
  const bookTarget = findBookId(bookId);
  if (bookTarget === null) return alert("books not found");

  bookTarget.completed = false;
  localStorage.setItem(localStorageKey, JSON.stringify(books));

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(bookIndex) {
  const bookTarget = findBookIndex(bookIndex);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  localStorage.setItem(localStorageKey, JSON.stringify(books));

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function editBook(bookId) {
  const bookTarget = findBookId(bookId);
  if (bookTarget === null) return alert("books not found");

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const search = document.getElementById("searchBookTitle");

search.addEventListener("keyup", function (e) {
  searchKeyword = e.target.value.toLowerCase();
  document.dispatchEvent(new Event(RENDER_EVENT));
});

//design tak perlu, system jalan nomor 1 🙏
