const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookFormSubmit");
  submitForm.addEventListener("click", function (event) {
    event.preventDefault();
    addBooks();
  });
});

function addBooks() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const isCompleted = document.getElementById("bookFormIsComplete").checked;

  const generatedBookID = generatedBookId();
  const booksObject = generatedBookForm(generatedBookID, bookTitle, bookAuthor, bookYear, isCompleted);

  books.push(booksObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
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
  console.log(books);

  const uncompleteBooks = document.getElementById("incompleteBookList");
  uncompleteBooks.innerHTML = "";

  for (const booksItem of books) {
    const bookElement = createNewBookList(booksItem);
    uncompleteBooks.append(bookElement);
  }
});

function createNewBookList(bookValue) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookValue.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookValue.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookValue.year;

  const buttonDelete = document.createElement("button");
  buttonDelete.innerText = "hapus buku";
  buttonDelete.addEventListener("click", function (e) {
    e.preventDefault();
    deleteBook(bookValue.id);
    console.log("button delete clicked");
  });

  const buttonEdit = document.createElement("button");
  buttonEdit.innerText = "edit buku";
  buttonEdit.addEventListener("click", function (e) {
    e.preventDefault();
    editBook(bookValue.id);
    console.log("button edit clicked");
  });

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(bookTitle, bookAuthor, bookYear, buttonDelete, buttonEdit);

  const container = document.createElement("section");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `books-${bookValue.id}`);

  if (bookValue.completed) {
    const buttonComplete = document.createElement("button");
    buttonComplete.innerText = "selesai dibaca";
    buttonComplete.addEventListener("click", function (e) {
      e.preventDefault();
      completedBooks(bookValue.id);
      console.log("button complete clicked");
    });

    container.append(buttonComplete);
  } else {
    const buttoninComplete = document.createElement("button");
    buttoninComplete.innerText = "belum selesai dibaca";
    buttoninComplete.addEventListener("click", function (e) {
      e.preventDefault();
      inCompletedBooks(bookValue.id);
      console.log("button complete clicked");
    });

    container.append(buttoninComplete);
  }

  return container;
}

console.log("Hello, world!");
