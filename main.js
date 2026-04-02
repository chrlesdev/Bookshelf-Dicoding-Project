let books = [];
const RENDER_EVENT = "render-book";
const localStorageKey = "BooksAreQuietMiracles";
let searchKeyword = "";

if (typeof Storage !== "undefined") {
  if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, JSON.stringify([]));
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookFormSubmit");
  const search = document.getElementById("searchBookTitle");

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

  if (search) {
    search.addEventListener("keyup", function (e) {
      searchKeyword = e.target.value.toLowerCase();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });
  }
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
  const container = document.createElement("div");
  container.setAttribute("data-testid", "bookItem");
  container.setAttribute("data-bookid", bookValue.id);
  container.setAttribute("id", `books-${bookValue.id}`);

  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.innerText = bookValue.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.innerText = `Penulis: ${bookValue.author}`;

  const bookYear = document.createElement("p");
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.innerText = `Tahun: ${bookValue.year}`;

  const buttonContainer = document.createElement("div");

  const buttonDelete = document.createElement("button");
  buttonDelete.innerText = "Hapus Buku";
  buttonDelete.setAttribute("data-testid", "bookItemDeleteButton");
  buttonDelete.addEventListener("click", function (e) {
    e.preventDefault();
    deleteBook(bookValue.id);
  });

  const buttonEdit = document.createElement("button");
  buttonEdit.innerText = "Edit Buku";
  buttonEdit.setAttribute("data-testid", "bookItemEditButton");
  buttonEdit.addEventListener("click", function (e) {
    e.preventDefault();
    editBook(bookValue.id);
  });

  const toggleButton = document.createElement("button");
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");

  if (bookValue.completed) {
    toggleButton.innerText = "belum selesai dibaca";
    toggleButton.addEventListener("click", function (e) {
      e.preventDefault();
      inCompletedBooks(bookValue.id);
    });
  } else {
    toggleButton.innerText = "selesai dibaca";
    toggleButton.addEventListener("click", function (e) {
      e.preventDefault();
      completedBooks(bookValue.id);
    });
  }

  buttonContainer.append(toggleButton, buttonDelete, buttonEdit);
  container.append(bookTitle, bookAuthor, bookYear, buttonContainer);
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

