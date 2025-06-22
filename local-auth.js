(function(){
  const USERS_KEY = 'users';
  const CURRENT_KEY = 'currentUser';

  function loadUsers(){
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  }
  function saveUsers(users){
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getUser(email){
    return loadUsers().find(u => u.email === email);
  }
  function setCurrentUser(user){
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  }
  function getCurrentUser(){
    return JSON.parse(localStorage.getItem(CURRENT_KEY));
  }

  // ensure root user
const usuarios = cargarUsers();
const existingRoot = usuarios.find(u => u.email === 'root@store.hn');

if (!existingRoot) {
  usuarios.push({
    email: 'root@store.hn',
    contraseña: 'superuserfs',
    rol: 'root'
  });
  saveUsers(usuarios);
} else if (existingRoot.contraseña !== 'superuserfs') {
  existingRoot.contraseña = 'superuserfs';
  saveUsers(usuarios);
}

  // login form
  const loginForm = document.getElementById('login-form');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const user = getUser(email);
      if(user && user.password === pass){
        setCurrentUser(user);
        window.location.href = (user.role === 'admin' || user.role === 'root') ? 'admin.html' : 'index.html';
      }else{
        alert('Credenciales incorrectas');
      }
    });
  }

  // register form
  const registerForm = document.getElementById('register-form');
  if(registerForm){
    registerForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = document.getElementById('register-email').value;
      const pass = document.getElementById('register-password').value;
      const name = document.getElementById('register-name').value;
      users = loadUsers();
      if(getUser(email)){
        alert('El usuario ya existe');
        return;
      }
      const newUser = {email, password: pass, name, role:'cliente'};
      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);
      window.location.href = 'index.html';
    });
  }

  const logoutBtn = document.getElementById('logoutBtn') || document.getElementById('logout-btn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', function(){
      localStorage.removeItem(CURRENT_KEY);
      window.location.href = 'login.html';
    });
  }

  window.localAuth = {getCurrentUser, getUser, saveUsers, loadUsers, setCurrentUser};
})();
