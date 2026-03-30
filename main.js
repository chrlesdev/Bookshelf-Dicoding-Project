const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookFormSubmit");
  submitForm.addEventListener("click", function (event) {
    event.preventDefault();
    addBooks();
    console.log("submit button clicked");
  });
});

function addBooks() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear");
  const isCompleted = document.getElementById("bookFormIsComplete").checked;

  const generatedBookID = generatedBookId();
  const booksObject = generatedBookForm(generatedBookID, bookTitle, bookAuthor, bookYear, isCompleted);

  books.push(booksObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generatedBookId() {
  return new Date();
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
  const uncompleteBooks = document.getElementById("books");
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

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(bookTitle, bookAuthor, bookYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `books-${bookValue.id}`);
}

console.log("Hello, world!");
