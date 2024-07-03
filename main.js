const books = [];
const RENDER_EVENT = 'render-book';

    document.getElementById('lihatButton').addEventListener('click', function () {
      document.getElementById('rak').scrollIntoView({ behavior: 'smooth' });
    });

    function scrollToCari() {
      document.getElementById('cari').scrollIntoView({ behavior: 'smooth' });}

      function scrollToDaftar() {
        document.getElementById('daftar').scrollIntoView({ behavior: 'smooth' });}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });


  function openModalConfirm() {
    document.getElementById('customModalConfirm').style.display = 'block';
  }

  
  function closeModalConfirm() {
    document.getElementById('customModalConfirm').style.display = 'none';
  }


  function addBook() {
    const judul = document.getElementById('inputBookTitle').value;
    const penulis = document.getElementById('inputBookAuthor').value;
    const tahunInput = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const tahun = parseInt(tahunInput);
   
    const generatedID = generateId();
    const bookObject = generatebookObject(generatedID, judul, penulis, tahun, isComplete);
    books.push(bookObject);

    openModalConfirm()
  
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
  document.getElementById('inputBookIsComplete').checked = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
};

  confirmActionConfirm = function () {
  closeModalConfirm();
  saveData();
}

  function generateId() {
    return +new Date();
  }

  function generatebookObject (id, title, author, year, isComplete,) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
  }

    document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
        uncompletedBOOKList.append(bookElement);
        } else
        completedBOOKList.append(bookElement);
    }

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    });
    });


  function makeBook(bookObject) {
    const judul = document.createElement('h2');
    judul.innerText = 'Judul Buku : ' + bookObject.title;
   
    const penulis = document.createElement('p');
    penulis.innerText = 'Penulis : ' + bookObject.author;

    const tahun = document.createElement('p');
    tahun.innerText = 'Tahun terbit : ' + bookObject.year;
   
    const textContainer = document.createElement('div');
    textContainer.append(judul, penulis, tahun);
   
    const container = document.createElement('div');
    container.classList.add('boxbuku');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
   
    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('blue');
        undoButton.innerText = 'Belum Selesai';
     
        undoButton.addEventListener('click', function () {
          undoBookFromCompleted(bookObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus';
     
        trashButton.addEventListener('click', function () {
          removeBookFromCompleted(bookObject.id);
        });
     
        container.append(undoButton, trashButton);
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('blue');
        checkButton.innerText = 'Sudah selesai';
        
        checkButton.addEventListener('click', function () {
          addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus';
     
        trashButton.addEventListener('click', function () {
          removeBookFromCompleted(bookObject.id);
        });
        
        container.append(checkButton,trashButton);
      }
     
      return container;
    }
  

    function addBookToCompleted (bookId) {
        const bookTarget = findBook(bookId);
       
        if (bookTarget == null) return;
       
        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }

      function findBook(bookId) {
        for (const bookItem of books) {
          if (bookItem.id === bookId) {
            return bookItem;
          }
        }
        return null;
      }


      function openModal() {
        document.getElementById('customModal').style.display = 'block';
      }

      
      function closeModal() {
        document.getElementById('customModal').style.display = 'none';
      }

      function removeBookFromCompleted(bookId) {
        const bookTarget = findBookIndex(bookId);
       
        if (bookTarget === -1) return;
        openModal();

        confirmAction = function () {
              books.splice(bookTarget, 1);
              document.dispatchEvent(new Event(RENDER_EVENT));
              saveData();
              closeModal();
            }
    };
  
      
       
      function undoBookFromCompleted(bookId) {
        const bookTarget = findBook(bookId);
       
        if (bookTarget == null) return;
       
        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }


      function findBookIndex(bookId) {
        for (const index in books) {
          if (books[index].id === bookId) {
            return index;
          }
        }
       
        return -1;
      }

      function saveData() {
        if (isStorageExist()) {
          const parsed = JSON.stringify(books);
          localStorage.setItem(STORAGE_KEY, parsed);
          document.dispatchEvent(new Event(SAVED_EVENT));
        }
      }

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function openModalSearchNull() {
  document.getElementById('customModalSearchNull').style.display = 'block';
}


function closeModalSearchNull() {
  document.getElementById('customModalSearchNull').style.display = 'none';
}

function confirmActionSearchNull() {
  closeModalSearchNull();
}

function searchBook() {
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();

  if (searchTitle === "") {
    openModalSearchNull();
  } else {
    const searchResult = books.filter(book => book.title.toLowerCase().includes(searchTitle));
    renderSearchResult(searchResult);
  }
}

function openModalNotFound() {
  document.getElementById('customModalNotFound').style.display = 'block';
}


function closeModalNotFound() {
  document.getElementById('customModalNotFound').style.display = 'none';
}

function confirmActionNotFound() {
  closeModalNotFound();
}

function renderSearchResult(result) {
  const searchResultContainer = document.getElementById('searchResult');
  searchResultContainer.innerHTML = '';

  if (result.length === 0) {
    openModalNotFound();
  } else {
      for (const bookItem of result) {
          const bookElement = makeBook(bookItem);
          searchResultContainer.appendChild(bookElement);
          bookElement.classList.add('boxbukuSearch');
      }
  }
}