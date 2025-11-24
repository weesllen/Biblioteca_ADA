// Gerenciamento de Usuários - Biblioteca Ada

let selectedUserId = null;
let isEditMode = false;

function renderUsers() {
    
    const savedAdmin = JSON.parse(localStorage.getItem("admin")) || null;
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    const allUsers = [];
    
    // Adiciona o admin padrão se existir
    if (savedAdmin) {
        allUsers.push({
            id: savedAdmin.id || 0,
            email: savedAdmin.email,
            username: savedAdmin.username,
            isAdmin: savedAdmin.isAdmin,
            isAdminUser: true
        });
    }

    // Adiciona todos os usuários (incluindo admins)
    savedUsers.forEach(user => {
        allUsers.push({
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin === true || user.isAdmin === "true",
            isAdminUser: false
        });
    });
    
    const userList = document.getElementById("userTableBody");
    if (!userList) return;
    
    if (allUsers.length === 0) {
        userList.innerHTML = `<tr><td colspan='5' style='text-align: center;'>Nenhum usuário cadastrado.</td></tr>`;
        return;
    }
    
    userList.innerHTML = allUsers.map((user, index) => {
        const isAdminValue = user.isAdmin === true || user.isAdmin === "true";
        const userType = isAdminValue ? '<span class="status-check">Administrador</span>' : '<span class="status-x">Usuário</span>';
        const userKey = user.id;
        
        return `
            <tr>
                <td>${user.id}</td>
                <td class="colTitle">${user.email}</td>
                <td>${user.username}</td>
                <td>${userType}</td>
                <td class="actions-column">
                    <div class="action-buttons">
                        ${!user.isAdminUser ? `
                            <button class="btn-action btn-edit" onclick="openEditForm(${userKey})" title="Editar">✏️</button>
                            <button class="btn-action btn-delete" onclick="confirmDelete(${userKey})" title="Excluir">🗑️</button>
                        ` : '<span style="color: #999;">-</span>'}
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function validateFullName(username) {
    const usernameWords = username.trim().split(/\s+/).filter(word => word.length > 0);
    return usernameWords.length >= 2;
}

function capitalizeName(name) {
    return name.trim().toLowerCase().split(/\s+/).map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function openCreateForm() {
    isEditMode = false;
    selectedUserId = null;
    document.getElementById("formTitle").textContent = "Criar Usuário";
    document.getElementById("formEmailInput").value = "";
    document.getElementById("formUsernameInput").value = "";
    document.getElementById("formPasswordInput").value = "";
    document.getElementById("formIsAdminInput").checked = false;
    document.getElementById("formEmailInput").disabled = false;
    document.getElementById("formPasswordInput").style.display = "block";
    document.getElementById("passwordLabel").style.display = "block";
    document.getElementById("formIsAdminInput").disabled = false;
    document.getElementById("userFormModal").classList.remove("hidden");
    document.getElementById("userFormModal").classList.add("active");
}

function openEditForm(userId) {
    const savedAdmin = JSON.parse(localStorage.getItem("admin")) || null;
    const isAdminUser = savedAdmin && savedAdmin.id === userId;
    
    if (isAdminUser) {
        alert("O usuário administrador padrão não pode ser editado através desta interface.");
        return;
    }
    
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = savedUsers.find(u => u.id === userId);
    
    if (!user) {
        alert("Usuário não encontrado");
        return;
    }
    
    isEditMode = true;
    selectedUserId = userId;
    document.getElementById("formTitle").textContent = "Editar Usuário";
    document.getElementById("formEmailInput").value = user.email;
    document.getElementById("formUsernameInput").value = user.username;
    document.getElementById("formIsAdminInput").checked = user.isAdmin || false;
    document.getElementById("formEmailInput").disabled = true;
    document.getElementById("formPasswordInput").style.display = "none";
    document.getElementById("passwordLabel").style.display = "none";
    document.getElementById("formIsAdminInput").disabled = false;
    document.getElementById("userFormModal").classList.remove("hidden");
    document.getElementById("userFormModal").classList.add("active");
}

function saveUser() {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const email = document.getElementById("formEmailInput").value.trim().toLowerCase();
    const usernameInput = document.getElementById("formUsernameInput").value.trim();
    const password = document.getElementById("formPasswordInput").value.trim();
    const isAdmin = document.getElementById("formIsAdminInput").checked;
    
    // Capitaliza a primeira letra de cada palavra do nome
    const username = capitalizeName(usernameInput);
    
    if (!email || !username) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    
    if (!email.includes("@") || !email.includes(".")) {
        alert("Email inválido");
        return;
    }
    
    if (!validateFullName(username)) {
        alert("Por favor, informe o nome completo (nome e sobrenome).");
        return;
    }
    
    if (isEditMode && selectedUserId) {
        const userIndex = savedUsers.findIndex(u => u.id === selectedUserId);
        if (userIndex === -1) {
            alert("Usuário não encontrado");
            return;
        }
        
        const user = savedUsers[userIndex];
        user.username = username; // Já capitalizado
        user.isAdmin = isAdmin;
        
        localStorage.setItem("users", JSON.stringify(savedUsers));
        alert("Usuário atualizado com sucesso!");
    } else {
        if (!password) {
            alert("Por favor, preencha a senha.");
            return;
        }
        
        if (savedUsers.find(u => u.email === email)) {
            alert("Email já existe");
            return;
        }
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (password.length < 6 || !hasUpperCase || !hasLowerCase || !hasNumber) {
            alert("A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número.");
            return;
        }
        
        const maxId = savedUsers.length > 0 
            ? Math.max(...savedUsers.map(u => u.id || 0)) 
            : 0;
        
        const newUser = {
            id: maxId + 1,
            email,
            username,
            password,
            isAdmin: isAdmin
        };
        
        savedUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(savedUsers));
        alert("Usuário criado com sucesso!");
    }
    
    renderUsers();
    closeForm();
}

function closeForm() {
    document.getElementById("userFormModal").classList.add("hidden");
    document.getElementById("userFormModal").classList.remove("active");
    document.getElementById("formPasswordInput").style.display = "block";
    document.getElementById("passwordLabel").style.display = "block";
    document.getElementById("formIsAdminInput").disabled = false;
    selectedUserId = null;
    isEditMode = false;
}

function confirmDelete(userId) {
    const savedAdmin = JSON.parse(localStorage.getItem("admin")) || null;
    const isAdminUser = savedAdmin && savedAdmin.id === userId;
    
    if (isAdminUser) {
        alert("O usuário administrador padrão não pode ser excluído.");
        return;
    }
    
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const index = savedUsers.findIndex(u => u.id === userId);
    
    if (index === -1) {
        alert("Usuário não encontrado");
        return;
    }

    const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
    const userToDelete = savedUsers[index];
    if (loggedUser && loggedUser.email === userToDelete.email) {
        alert("Você não pode excluir seu próprio usuário enquanto estiver logado.");
        return;
    }
    
    savedUsers.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(savedUsers));
    renderUsers();
}

function logOut() {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
}

const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");

if (!loggedUser || !loggedUser.isAdmin) {
    alert("Acesso negado. Redirecionando...");
    window.location.href = "login.html";
} else {
    renderUsers();
}

