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
const pantalla404 = ` <h1 class="app-container-title">404</h1>
            <p>Página en construcción</p>
            <div class="button-container">
              <button onclick="renderLogin()">Volver al Login</button>
            </div>`;

function renderLogin() {
  app.innerHTML = pantallaLogin;
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
      app.innerHTML = pantalla404;
    } else {
      // Muestra un mensaje si las credenciales son incorrectas
      alert("Usuario o contraseña incorrectos");
    }
  };
}
renderLogin();

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

  const registerForm = document.getElementById("register-form");
  registerForm.onsubmit = (evento) => {
    evento.preventDefault();
    const username = evento.target.username.value;
    const password1 = evento.target.password1.value;
    const password2 = evento.target.password2.value;

    // Revisar que no exista el usuario
    const usuarioExistente = bdUsuarios.find(
      (usuario) => usuario.username === username
    );

    if (usuarioExistente) {
      alert("Usuario ya existe");
      return;
    }

    // Revisar que las contraseñas sean iguales
    if (password1 !== password2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const nuevoID = bdUsuarios[bdUsuarios.length - 1]?.id + 1 || 1;
    // Crear usuario
    const nuevoUsuario = {
      username: username,
      password: password1,
      id: nuevoID,
    };

    // Actualizar base de datos de trabajo
    bdUsuarios.push(nuevoUsuario);

    // Actualizar localStorage
    const bdUsuariosJSON = JSON.stringify(bdUsuarios);
    localStorage.setItem("usuarios", bdUsuariosJSON);

    // Redirigir a la pantalla 404
    app.innerHTML = pantalla404;
  };
}
