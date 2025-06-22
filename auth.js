// Firebase auth and user role handling
// Requires Firebase SDK loaded globally

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
let currentUserRole = null;

// Monitor authentication state
if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            try {
                const snapshot = await firebase.firestore().collection('users').doc(user.uid).get();
                const data = snapshot.data();
                currentUserRole = data && data.role ? data.role : 'user';
                if (currentUserRole === 'admin') {
                    // If already on login page, redirect to admin dashboard
                    if (window.location.pathname.endsWith('login.html')) {
                        window.location.href = 'admin.html';
                    }
                }
            } catch (err) {
                console.error('Error getting user role', err);
            }
        }
    });
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (err) {
            alert('Error al iniciar sesión: ' + err.message);
        }
    });
}

// Handle registration form submission
if (registerForm) {
    registerForm.addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const name = document.getElementById('register-name').value;
        try {
            const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await firebase.firestore().collection('users').doc(cred.user.uid).set({
                name: name,
                role: 'user'
            });
        } catch (err) {
            alert('Error al registrar: ' + err.message);
        }
    });
}