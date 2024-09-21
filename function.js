document.addEventListener("DOMContentLoaded", function () {
    const unfinishedShelf = document.getElementById("unfinishedShelf");
    const finishedShelf = document.getElementById("finishedShelf");
    const unfinishedList = document.getElementById("unfinishedList");
    const finishedList = document.getElementById("finishedList");
    const bookForm = document.getElementById("bookForm");
  
    // Load saved books from localStorage
    const savedBooks = JSON.parse(localStorage.getItem("books")) || [];
    savedBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        finishedList.appendChild(bookElement);
      } else {
        unfinishedList.appendChild(bookElement);
      }
    });
  
    bookForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
  
    function createBookElement(book) {
      const bookElement = document.createElement("li");
      bookElement.innerHTML = `
              <strong>${book.title}</strong> oleh ${book.author} (${book.year})
              <button class="moveButton">Pindah</button>
              <button class="deleteButton">Hapus</button>
          `;
      const moveButton = bookElement.querySelector(".moveButton");
      const deleteButton = bookElement.querySelector(".deleteButton");
  
      moveButton.addEventListener("click", function () {
        moveBook(bookElement, book.isComplete);
      });
  
      deleteButton.addEventListener("click", function () {
        deleteBook(bookElement, book.isComplete, book.id);
      });
  
      return bookElement;
    }
  
    function addBook() {
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const year = document.getElementById("year").value;
      const isComplete = document.getElementById("isComplete").checked;
  
      const book = { id: +new Date(), title, author, year, isComplete };
      const bookElement = createBookElement(book);
  
      if (isComplete) {
        finishedList.appendChild(bookElement);
      } else {
        unfinishedList.appendChild(bookElement);
      }
  
      // Save updated book list to localStorage
      saveBooks();
      resetForm();
    }
  
    function moveBook(bookElement, isComplete) {
      if (isComplete) {
        unfinishedList.appendChild(bookElement);
      } else {
        finishedList.appendChild(bookElement);
      }
  
      // Save updated book list to localStorage
      saveBooks();
    }
  
    function deleteBook(bookElement, isComplete, bookId) {
      if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
        bookElement.remove();
  
        // Remove book from savedBooks
        const savedBooks = JSON.parse(localStorage.getItem("books")) || [];
        const updatedBooks = savedBooks.filter((book) => book.id !== bookId);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
      }
    }
  
    function resetForm() {
      bookForm.reset();
    }
  
    function saveBooks() {
      const bookElements = Array.from(unfinishedList.children).concat(
        Array.from(finishedList.children)
      );
      const books = bookElements.map((bookElement) => {
        const [title, author, year] = bookElement.innerHTML
          .match(/<strong>(.*?)<\/strong> oleh (.*?) \((\d{4})\)/)
          .slice(1, 4);
        const isComplete = bookElement.parentElement.id === "finishedList";
        return { id: +new Date(), title, author, year: +year, isComplete };
      });
  
      localStorage.setItem("books", JSON.stringify(books));
    }
  });
  