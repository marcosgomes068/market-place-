document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    try {
        showSpinner();
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        
        hideSpinner();
        
        if (response.ok) {
            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showNotification('Login realizado com sucesso!');
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            const error = await response.json();
            showNotification(error.message || 'Erro de autenticação', 'error');
        }
    } catch (error) {
        hideSpinner();
        console.error('Login error:', error);
        showNotification('Erro ao conectar ao servidor', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.querySelector('input[name="role"]:checked')?.value || 'user';
    
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não correspondem', 'error');
        return;
    }
    
    try {
        showSpinner();
        
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role
            })
        });
        
        hideSpinner();
        
        if (response.ok) {
            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showNotification('Registro realizado com sucesso!');
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            const error = await response.json();
            showNotification(error.message || 'Erro ao registrar', 'error');
        }
    } catch (error) {
        hideSpinner();
        console.error('Registration error:', error);
        showNotification('Erro ao conectar ao servidor', 'error');
    }
}

function handleLogout(event) {
    event.preventDefault();
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    showNotification('Logout realizado com sucesso!');
    
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
}

function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

function getToken() {
    return localStorage.getItem('token');
}

function getUserData() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
}

function redirectToLogin() {
    window.location.href = '/login.html';
}
