const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("submit");
  submitForm.addEventListener("click", function (event) {
    event.preventDefault();
    addBooks();
  });
});

function addBooks(inputValue) {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear");
  const isCompleted = document.getElementById("bookFormIsCompleted").value;

  const generatedBookID = generatedBookId();
  const booksObject = generatedBookForm(generatedBookID, bookTitle, bookAuthor, bookYear, isCompleted);

  books.push(booksObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generatedBookID() {
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

console.log("Hello, world!");
