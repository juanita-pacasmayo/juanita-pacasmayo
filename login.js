// ==========================================================
// JUANITA PACASMAYO
// LOGIN ADMINISTRATIVO
// ==========================================================


// ==========================================================
// DATOS DE ACCESO
// ==========================================================

const USUARIO_ADMIN = "admin";

const CONTRASENA_ADMIN = "Juanita2026";


// ==========================================================
// ELEMENTOS
// ==========================================================

const loginForm =
  document.getElementById("loginForm");

const usuario =
  document.getElementById("usuario");

const contrasena =
  document.getElementById("contrasena");

const mensajeLogin =
  document.getElementById("mensajeLogin");


// ==========================================================
// MOSTRAR MENSAJE
// ==========================================================

function mostrarMensajeLogin(
  mensaje,
  tipo
) {

  mensajeLogin.textContent =
    mensaje;

  mensajeLogin.className =
    "mensaje-registro " + tipo;

}


// ==========================================================
// INICIAR SESIÓN
// ==========================================================

loginForm.addEventListener(
  "submit",
  function(evento) {

    evento.preventDefault();


    const usuarioIngresado =
      usuario.value.trim();

    const contrasenaIngresada =
      contrasena.value;


    // ------------------------------------------------------
    // VALIDAR
    // ------------------------------------------------------

    if (
      usuarioIngresado ===
      USUARIO_ADMIN &&
      contrasenaIngresada ===
      CONTRASENA_ADMIN
    ) {


      mostrarMensajeLogin(
        "✅ Acceso correcto. Entrando...",
        "exito"
      );


      // ----------------------------------------------------
      // GUARDAR SESIÓN
      // ----------------------------------------------------

      sessionStorage.setItem(
        "adminAutorizado",
        "true"
      );


      // ----------------------------------------------------
      // IR AL PANEL
      // ----------------------------------------------------

      setTimeout(
        function() {

          window.location.href =
            "admin.html";

        },
        500
      );


    } else {


      mostrarMensajeLogin(
        "❌ Usuario o contraseña incorrectos.",
        "error"
      );


      contrasena.value = "";

      contrasena.focus();

    }

  }
);


// ==========================================================
// INICIO
// ==========================================================

console.log(
  "✅ login.js cargado correctamente."
);
