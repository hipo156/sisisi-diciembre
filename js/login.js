
const body = document.body;

// Función para alternar el modo oscuro/claro
function toggleTheme() {
  body.classList.toggle("dark-mode");

  const themeToggle = document.getElementById("theme-toggle");
  if (body.classList.contains("dark-mode")) {
    themeToggle.textContent = "Modo Claro";
  } else {
    themeToggle.textContent = "Modo Oscuro";
  }

  // Guarda el estado del tema en localStorage
  localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
}

function addThemeToggleEvent() {
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.onclick = toggleTheme;

  // Mantiene el estado del modo oscuro al renderizar nuevas pantallas
  if (body.classList.contains("dark-mode")) {
    themeToggle.textContent = "Modo Claro";
  } else {
    themeToggle.textContent = "Modo Oscuro";
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }
}

loadTheme();

// Pantalla principal o Login
const app = document.getElementById("app");
const pantallaLogin = `<h1 class="app-container-title">¡Bienvenido!</h1>
            <form class="form" id="login-form">
              <input
                name="username"
                type="text"
                placeholder=" Usuario"
                required
              />
              <input
                name="password"
                type="password"
                placeholder=" Contraseña"
                required
              />
              <input type="submit" value="Login" />
            </form>
            <div class="button-container">
              <button onclick="renderRegistro()">Crear cuenta</button>
            </div>`;

const pantalla404 = `<h1 class="app-container-title">404</h1>
            <p>Página en construcción</p>
            <div class="button-container">
              <button onclick="renderLogin()">Volver al Login</button>
            </div>`;


function verificarSesion() {
  const usuarioLogueado = localStorage.getItem("usuario");
  const horaUltimaSesion = localStorage.getItem("horaUltimaSesion");

  if (usuarioLogueado) {
    // Calcula el tiempo de inactividad en minutos
    const tiempoInactividad = (new Date().getTime() - horaUltimaSesion) / 1000 / 60;

    if (tiempoInactividad < 10) {
      app.innerHTML = pantalla404; 
      addThemeToggleEvent(); 
      iniciarContadorInactividad(); 
    } else {
      // Si han pasado más de 10 minutos, redirige al login
      localStorage.removeItem("usuario");
      localStorage.removeItem("horaUltimaSesion");
      renderLogin(); // Muestra la pantalla de login
    }
  } else {
    renderLogin(); // Si no está logueado, muestra la pantalla de login
  }
}

function renderLogin() {
  app.innerHTML = pantallaLogin;
  addThemeToggleEvent(); // Vuelve a añadir el evento al botón

  // Lógica de Login
  const loginForm = document.getElementById("login-form");

  loginForm.onsubmit = (evento) => {
    evento.preventDefault();
    const username = evento.target.username.value;
    const password = evento.target.password.value;

    const usuarioEncontrado = bdUsuarios.find(
      (usuario) => usuario.username === username && usuario.password === password
    );

    if (usuarioEncontrado) {
      // Usuario y contraseña correctos, redirige a la siguiente pantalla
      localStorage.setItem("usuario", username); // Guarda el usuario en localStorage
      localStorage.setItem("horaUltimaSesion", new Date().getTime()); // Guarda la hora de inicio de sesión
      app.innerHTML = pantalla404;
      addThemeToggleEvent(); 
      iniciarContadorInactividad(); // Inicia el contador de inactividad para redirigir después de 10 minutos
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };
}

// Pantalla Registro
const pantallaRegistro = `<h1 class="app-container-title">Registro</h1>
            <form class="form" id="register-form">
              <input
                name="username"
                type="text"
                placeholder=" Usuario nuevo"
                required
              />
              <input
                name="password1"
                type="password"
                placeholder=" Contraseña"
                required
              />
              <input
                name="password2"
                type="password"
                placeholder=" Repetir Contraseña"
                required
              />
              <input type="submit" value="Crear" />
            </form>
            <div class="button-container">
              <button onclick="renderLogin()">Volver al Login</button>
            </div>`;

function renderRegistro() {
  app.innerHTML = pantallaRegistro;
  addThemeToggleEvent(); 

  const registerForm = document.getElementById("register-form");
  registerForm.onsubmit = (evento) => {
    evento.preventDefault();
    const username = evento.target.username.value;
    const password1 = evento.target.password1.value;
    const password2 = evento.target.password2.value;

    const usuarioExistente = bdUsuarios.find(
      (usuario) => usuario.username === username
    );

    if (usuarioExistente) {
      alert("Usuario ya existe");
      return;
    }

    if (password1 !== password2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const nuevoID = bdUsuarios[bdUsuarios.length - 1]?.id + 1 || 1;
    const nuevoUsuario = {
      username: username,
      password: password1,
      id: nuevoID,
    };

    bdUsuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(bdUsuarios));

    localStorage.setItem("usuario", username); // Guarda el usuario registrado
    localStorage.setItem("horaUltimaSesion", new Date().getTime()); // Guarda la hora de inicio de sesión
    app.innerHTML = pantalla404;
    addThemeToggleEvent(); 
    iniciarContadorInactividad();
  };
}

// Llama a la función para verificar si el usuario está logueado al cargar la página
verificarSesion();

// Función que actualiza la hora de la última sesión al realizar cualquier acción
function actualizarHoraUltimaSesion() {
  localStorage.setItem("horaUltimaSesion", new Date().getTime());
}

// Evento para actualizar la hora de la última sesión cada vez que el usuario interactúe con la página
window.addEventListener('mousemove', actualizarHoraUltimaSesion);
window.addEventListener('keydown', actualizarHoraUltimaSesion);


function iniciarContadorInactividad() {
  setTimeout(() => {
    // Si pasan 10 minutos sin actividad, redirige al login
    localStorage.removeItem("usuario");
    localStorage.removeItem("horaUltimaSesion");
    renderLogin(); 
  }, 10 * 60 * 1000); // 10 minutos en milisegundos
}

