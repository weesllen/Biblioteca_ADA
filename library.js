// Biblioteca Ada

if (!localStorage.getItem("books")) {
    const books = [
        {id: 1, title: "O Senhor dos Anéis", author: "J.R.R. Tolkien", year: 1954, available: true, renter: null, returnDate: null},
        {id: 2, title: "1984", author: "George Orwell", year: 1949, available: true, renter: null, returnDate: null},
        {id: 3, title: "Dom Quixote", author: "Miguel de Cervantes", year: 1605, available: true, renter: null, returnDate: null},
        {id: 4, title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", year: 1943, available: true, renter: null, returnDate: null},
        {id: 5, title: "Cem Anos de Solidão", author: "Gabriel García Márquez", year: 1967, available: true, renter: null, returnDate: null},
        {id: 6, title: "A Metamorfose", author: "Franz Kafka", year: 1915, available: true, renter: null, returnDate: null},
        {id: 7, title: "O Grande Gatsby", author: "F. Scott Fitzgerald", year: 1925, available: true, renter: null, returnDate: null},
        {id: 8, title: "Moby Dick", author: "Herman Melville", year: 1851, available: true, renter: null, returnDate: null},
        {id: 9, title: "Harry Potter e a Pedra Filosofal", author: "J.K. Rowling", year: 1997, available: true, renter: null, returnDate: null}
    ];
    localStorage.setItem("books", JSON.stringify(books));
}

let selectedBookId = null;
let isEditMode = false;
const isAdmin = window.location.pathname.includes("admin.html");

function renderBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const bookList = document.getElementById("bookTableBody");
    if (!bookList) return;

    const booksToShow = isAdmin ? books : books.filter(book => book.available);
    
    if (booksToShow.length === 0) {
        const cols = isAdmin ? 7 : 4;
        bookList.innerHTML = `<tr><td colspan='${cols}' style='text-align: center;'>Nenhum livro disponível no momento.</td></tr>`;
        return;
    }

    bookList.innerHTML = booksToShow.map(book => {
        const status = book.available ? '<span class="status-check">&#10003;</span>' : '<span class="status-x">&#10007;</span>';
        
        if (isAdmin) {
            return `
                <tr>
                    <td class="colTitle">${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.year}</td>
                    <td>${status}</td>
                    <td>${book.renter || '-'}</td>
                    <td>${book.returnDate || '-'}</td>
                    <td class="actions-column">
                        <div class="action-buttons">
                            <button class="btn-action btn-edit" onclick="openEditForm(${book.id})" title="Editar">✏️</button>
                            <button class="btn-action btn-delete" onclick="confirmDelete(${book.id})" title="Excluir">🗑️</button>
                            ${book.available 
                                ? `<button class="btn-action btn-rent" onclick="openRentModal(${book.id})" title="Alugar">📖</button>`
                                : `<button class="btn-action btn-rent" onclick="returnBook(${book.id})" title="Devolver">↩️</button>`}
                        </div>
                    </td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td class="colTitle">${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.year}</td>
                    <td>${status}</td>
                </tr>
            `;
        }
    }).join("");
}

function openCreateForm() {
    isEditMode = false;
    selectedBookId = null;
    document.getElementById("formTitle").textContent = "Criar Livro";
    document.getElementById("formTitleInput").value = "";
    document.getElementById("formAuthorInput").value = "";
    document.getElementById("formYearInput").value = "";
    document.getElementById("bookFormModal").classList.remove("hidden");
    document.getElementById("bookFormModal").classList.add("active");
}

function openEditForm(bookId) {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id === bookId);
    if (!book) {
        alert("Livro não encontrado");
        return;
    }
    isEditMode = true;
    selectedBookId = bookId;
    document.getElementById("formTitle").textContent = "Editar Livro";
    document.getElementById("formTitleInput").value = book.title;
    document.getElementById("formAuthorInput").value = book.author;
    document.getElementById("formYearInput").value = book.year;
    document.getElementById("bookFormModal").classList.remove("hidden");
    document.getElementById("bookFormModal").classList.add("active");
}

function saveBook() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const title = document.getElementById("formTitleInput").value.trim();
    const author = document.getElementById("formAuthorInput").value.trim();
    const year = parseInt(document.getElementById("formYearInput").value);

    if (!title || !author || isNaN(year) || year < 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    if (isEditMode && selectedBookId) {
        const book = books.find(b => b.id === selectedBookId);
        if (book) {
            book.title = title;
            book.author = author;
            book.year = year;
        }
    } else {
        const maxId = books.length > 0 ? Math.max(...books.map(b => b.id)) : 0;
        books.push({
            id: maxId + 1,
            title, author, year,
            available: true,
            renter: null,
            returnDate: null
        });
    }

    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
    closeForm();
}

function closeForm() {
    document.getElementById("bookFormModal").classList.add("hidden");
    document.getElementById("bookFormModal").classList.remove("active");
    selectedBookId = null;
    isEditMode = false;
}

function confirmDelete(bookId) {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;
    
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const index = books.findIndex(b => b.id === bookId);
    if (index === -1) {
        alert("Livro não encontrado");
        return;
    }
    
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
}

function openRentModal(bookId) {
    selectedBookId = bookId;
    
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userSelect = document.getElementById("rentUserSelect");
    
    userSelect.innerHTML = '<option value="">-- Selecione um usuário --</option>';
    
    savedUsers.forEach(user => {
        const option = document.createElement("option");
        option.value = user.email;
        option.textContent = `${user.username} (${user.email})`;
        userSelect.appendChild(option);
    });
    
    userSelect.value = "";
    
    document.getElementById("rentModal").classList.remove("hidden");
    document.getElementById("rentModal").classList.add("active");
}

function confirmRent() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id === selectedBookId);
    const userEmail = document.getElementById("rentUserSelect").value;

    if (!book) {
        alert("Livro não encontrado");
        return;
    }
    if (!userEmail) {
        alert("Por favor, selecione um usuário.");
        return;
    }
    if (!book.available) {
        alert("Este livro já está alugado.");
        return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const selectedUser = savedUsers.find(u => u.email === userEmail);
    
    if (!selectedUser) {
        alert("Usuário não encontrado.");
        return;
    }

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 7);

    book.available = false;
    book.renter = selectedUser.username; 
    book.renterEmail = selectedUser.email; 
    book.returnDate = returnDate.toLocaleDateString("pt-BR");

    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
    closeRentModal();
}

function closeRentModal() {
    document.getElementById("rentModal").classList.add("hidden");
    document.getElementById("rentModal").classList.remove("active");
    selectedBookId = null;
}

function returnBook(bookId) {
    if (!confirm("Confirmar devolução do livro?")) return;
    
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        alert("Livro não encontrado");
        return;
    }
    if (book.available) {
        alert("Este livro já está disponível.");
        return;
    }

    book.available = true;
    book.renter = null;
    book.renterEmail = null;
    book.returnDate = null;

    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
}

function logOut() {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
}

const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");

if (isAdmin) {
    if (!loggedUser || !loggedUser.isAdmin) {
        alert("Acesso negado. Redirecionando...");
        window.location.href = "login.html";
    } else {
        renderBooks();
    }
} else if (window.location.pathname.includes("library.html")) {
    if (!loggedUser) {
        alert("Por favor, faça login para acessar a biblioteca.");
        window.location.href = "login.html";
    } else {
        renderBooks();
    }
}
