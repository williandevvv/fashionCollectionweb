const usuarioActual = localAuth.getCurrentUser() || { rol: 'invitado' };

// Cargar tareas desde localStorage o iniciar vacío
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// Mostrar tareas en el tablero correspondiente
function renderTareas() {
  const secciones = {
    pendientes: document.getElementById("pendingTasks"),
    proceso: document.getElementById("inProgressTasks"),
    completadas: document.getElementById("completedTasks")
  };

  // Limpiar contenidos previos
  Object.values(secciones).forEach(s => s.innerHTML = "");

  tareas.forEach(t => {
    const contenedor = document.createElement("div");
    contenedor.className = `task-item priority-${t.prioridad} ${t.estado}`;

    contenedor.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h6>${t.descripcion}</h6>
          <small>Asignado a: ${t.asignadoA}</small>
        </div>
        ${t.estado !== "completada" ? `
        <button class="btn btn-sm btn-outline-success" onclick="ejecutarTarea('${t.id}')">
          Ejecutar
        </button>` : `<span class='badge bg-success'>Listo</span>`}
      </div>`;

    if (t.estado === "pendiente") secciones.pendientes.appendChild(contenedor);
    else if (t.estado === "en_proceso") secciones.proceso.appendChild(contenedor);
    else if (t.estado === "completada") secciones.completadas.appendChild(contenedor);
  });
}

// Ejecutar acción de una tarea
function ejecutarTarea(id) {
  const tarea = tareas.find(t => t.id === id);

  if (tarea.requierePermiso && usuarioActual.rol !== "root" && usuarioActual.rol !== "admin") {
    return alert("No tienes permisos para esta acción.");
  }

  // Simular acciones disponibles
  switch (tarea.accion) {
    case "cambiar_precio":
      console.log(`Precio del producto ${tarea.productoId} actualizado a L${tarea.nuevoPrecio}`);
      break;
    case "agregar_producto":
      console.log(`Producto '${tarea.producto.nombre}' agregado.`);
      break;
    default:
      console.log("Acción no reconocida");
  }

  tarea.estado = "completada";
  localStorage.setItem("tareas", JSON.stringify(tareas));
  renderTareas();
}

// Inicializar al cargar
renderTareas();

const taskFormEl = document.getElementById('task-form');
if (taskFormEl) {
  taskFormEl.addEventListener('submit', e => {
    e.preventDefault();
    if (usuarioActual.rol !== 'admin' && usuarioActual.rol !== 'root') {
      alert('No tienes permisos para crear tareas');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      descripcion: document.getElementById('task-title').value,
      prioridad: document.getElementById('task-priority').value,
      asignadoA: document.getElementById('task-assigned').value,
      accion: document.getElementById('task-action').value,
      requierePermiso: true,
      estado: 'pendiente'
    };
    tareas.push(newTask);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    renderTareas();
    bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
    taskFormEl.reset();
  });
}

function grantPermission(email, role) {
  if (usuarioActual.rol !== 'root') {
    alert('Solo el usuario root puede asignar roles');
    return;
  }
  const users = localAuth.loadUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    user.role = role;
    localAuth.saveUsers(users);
    alert('Permiso actualizado');
  }
}
