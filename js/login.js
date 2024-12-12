
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
  if (themeToggle) {
    themeToggle.onclick = toggleTheme;

    if (body.classList.contains("dark-mode")) {
      themeToggle.textContent = "Modo Claro";
    } else {
      themeToggle.textContent = "Modo Oscuro";
    }
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }
}

loadTheme();

// Pantalla del dado
const imagenesDado = [
  "../assets/1.png",
  "../assets/2.png",
  "../assets/3.png",
  "../assets/4.png",
  "../assets/5.png",
  "../assets/6.png",
];

const pantallaDados = `
  <h1 class="app-container-title">Dados</h1>
  <div style="text-align: center;">
    <div>
      <img src="${imagenesDado[0]}" alt="Dado" id="dado" style="width: 100px; height: 100px;" />
    </div>
    <p><strong>Bienvenido</strong> <span id="username"></span></p>
    <p><strong>Total acumulado:</strong> <span id="total-acumulado">0</span></p>
    <button id="lanzar" style="padding: 10px; font-size: 16px;">Lanzar</button>
  </div>`;

function renderDados() {
  app.innerHTML = pantallaDados;
  addThemeToggleEvent();

  const username = localStorage.getItem("usuario") || "Invitado";
  document.getElementById("username").textContent = username;

  let totalAcumulado = 0;

  document.getElementById("lanzar").onclick = () => {
    const dado = document.getElementById("dado");

    // Genera número aleatorio entre 1 y 6
    const resultado = Math.floor(Math.random() * 6) + 1;

    // Cambia la imagen del dado
    dado.src = imagenesDado[resultado - 1];

    // Actualiza el total acumulado
    totalAcumulado += resultado;
    document.getElementById("total-acumulado").textContent = totalAcumulado;

    actualizarHoraUltimaSesion(); // Actualiza la sesión
  };
}

// Verifica sesión y redirige
function verificarSesion() {
  const usuarioLogueado = localStorage.getItem("usuario");
  const horaUltimaSesion = localStorage.getItem("horaUltimaSesion");

  if (usuarioLogueado) {
    const tiempoInactividad = (new Date().getTime() - horaUltimaSesion) / 1000 / 60;

    if (tiempoInactividad < 10) {
      renderDados();
      iniciarContadorInactividad();
    } else {
      localStorage.removeItem("usuario");
      localStorage.removeItem("horaUltimaSesion");
      renderLogin();
    }
  } else {
    renderLogin();
  }
}

function renderLogin() {
  app.innerHTML = pantallaLogin;
  addThemeToggleEvent();

  const loginForm = document.getElementById("login-form");
  loginForm.onsubmit = (evento) => {
    evento.preventDefault();
    const username = evento.target.username.value;
    const password = evento.target.password.value;

    const usuarioEncontrado = bdUsuarios.find(
      (usuario) => usuario.username === username && usuario.password === password
    );

    if (usuarioEncontrado) {
      localStorage.setItem("usuario", username);
      localStorage.setItem("horaUltimaSesion", new Date().getTime());
      renderDados();
      iniciarContadorInactividad();
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };
}

function iniciarContadorInactividad() {
  setTimeout(() => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("horaUltimaSesion");
    renderLogin();
  }, 10 * 60 * 1000);
}

function actualizarHoraUltimaSesion() {
  localStorage.setItem("horaUltimaSesion", new Date().getTime());
}

// Registro
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
    const nuevoUsuario = { username, password: password1, id: nuevoID };
    bdUsuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(bdUsuarios));
    localStorage.setItem("usuario", username);
    localStorage.setItem("horaUltimaSesion", new Date().getTime());

    renderDados();
    iniciarContadorInactividad();
  };
}

// Inicia la verificación de sesión
verificarSesion();
);
    renderLogin(); 
  }, 10 * 60 * 1000); // 10 minutos en milisegundos
}

