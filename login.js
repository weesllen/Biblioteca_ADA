//login Biblioteca ADA


if (!localStorage.getItem("admin")) {
    const usersAdmin= {id: 1, email: "admin",username: "admin", password: "admin123", isAdmin: true};
    localStorage.setItem("admin", JSON.stringify(usersAdmin));
}


document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("registerButton").addEventListener("click",registerUser);

function login()  {
    const savedAdmin = JSON.parse(localStorage.getItem("admin"));
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    
    const loginAdmin = savedAdmin && email === savedAdmin.email && password === savedAdmin.password;
    const user = savedUsers.find(u => u.email === email && u.password === password);
   
    if (user || loginAdmin) {

        const logged = loginAdmin ? savedAdmin : user;

        localStorage.setItem("loggedUser", JSON.stringify(logged));

        alert("Login feito com sucesso!");
        if (logged.isAdmin) {
            window.location.href = "admin.html";
        } else {
            window.location.href = "library.html";
        }
        return;
   
    } else {
        alert("email ou senha inválidos");
    }

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

function registerUser() {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const email = document.getElementById("emailRegister").value;
    const usernameInput = document.getElementById("usernameRegister").value.trim();
    const password = document.getElementById("passwordRegister").value;
    
    // Capitaliza a primeira letra de cada palavra do nome
    const username = capitalizeName(usernameInput);
    
    if(savedUsers.find(u => u.email === email)) {
        alert("Email já existe");
        return;
    }
    
    if (!email.includes("@") && !email.includes(".")) {
        alert("Email inválido");
        return;
    }

    if (!validateFullName(usernameInput)) {
        alert("Por favor, informe o nome completo (nome e sobrenome).");
        return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (password.length < 6 || !hasUpperCase || !hasLowerCase || !hasNumber) {
        alert("A senha deve ter pelo menos 6 caracteres, incluindo uma Letra maiuscula , uma letra minuscula e um numero.");
        return;
    }
    
    const maxId = savedUsers.length > 0 
        ? Math.max(...savedUsers.map(u => u.id || 0)) 
        : 0;
    
    const newUser = {id: maxId + 1, email, username, password, isAdmin: false};
    savedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(savedUsers));

    alert("Usuário registrado com sucesso!");
    window.location.href = "login.html";
}