//Admin dashboard functionality
// Requires Firebase SDK and auth.js loaded

let userRole = null;

// Permitir también autenticación local
const localUser = window.localAuth ? localAuth.getCurrentUser() : null;
if (localUser) {
    userRole = localUser.role;
    if (userRole !== 'admin' && userRole !== 'root') {
        window.location.href = 'login.html';
    }
} else if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(async user => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        try {
            const doc = await firebase.firestore().collection('users').doc(user.uid).get();
            userRole = doc.data() ? doc.data().role : 'user';
            if (userRole !== 'admin') {
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error obteniendo rol', err);
            window.location.href = 'login.html';
        }
    });
} else {
    window.location.href = 'login.html';
}

// Add task logic
const taskForm = document.getElementById('task-form');
if (taskForm) {
    taskForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (userRole !== 'admin' && userRole !== 'root') {
            alert('No tienes permisos para crear tareas');
            return;
        }
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const priority = document.getElementById('task-priority').value;
        const due = document.getElementById('task-due').value;
        const assigned = document.getElementById('task-assigned').value;
        try {
            await firebase.firestore().collection('tasks').add({
                title: title,
                description: desc,
                priority: priority,
                dueDate: due,
                assignedTo: assigned,
                status: 'pending'
            });
            taskForm.reset();
            const modalEl = document.getElementById('addTaskModal');
            if (typeof bootstrap !== 'undefined') {
                bootstrap.Modal.getInstance(modalEl).hide();
            }
        } catch (err) {
            alert('Error al crear tarea: ' + err.message);
        }
    });
}