const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");

  const abierto = mainNav.classList.contains("open");
  menuToggle.setAttribute("aria-expanded", abierto);
});

document.querySelectorAll(".main-nav a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});


// ==========================================
// CONEXIÓN CON APPS SCRIPT
// ==========================================

const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";

fetch(URL_APPS_SCRIPT)
  .then(response => {
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    return response.json();
  })
  .then(data => {
    console.log("✅ Respuesta de Apps Script:", data);
  })
  .catch(error => {
    console.error("❌ Error conectando con Apps Script:", error);
  });

// ==========================================
// CONSULTAR PUNTOS DEL CLIENTE
// ==========================================

const btnConsultarPuntos =
  document.getElementById("btnConsultarPuntos");

const codigoClienteInput =
  document.getElementById("codigoCliente");

const mensajePuntos =
  document.getElementById("mensajePuntos");

const resultadoPuntos =
  document.getElementById("resultadoPuntos");

const nombreCliente =
  document.getElementById("nombreCliente");

const cantidadPuntos =
  document.getElementById("cantidadPuntos");


if (btnConsultarPuntos) {

  btnConsultarPuntos.addEventListener("click", consultarPuntosWeb);

}


function consultarPuntosWeb() {

  const codigo =
    codigoClienteInput.value.trim().toUpperCase();


  // Limpiar mensajes anteriores

  mensajePuntos.textContent = "";

  resultadoPuntos.style.display = "none";


  // Comprobar que escribió un código

  if (!codigo) {

    mensajePuntos.textContent =
      "Por favor, ingresa tu código de cliente.";

    return;
  }


  // Mostrar mensaje mientras consulta

  mensajePuntos.textContent =
    "Consultando tus puntos...";


  const url =
    URL_APPS_SCRIPT +
    "?accion=consultarPuntos&codigo=" +
    encodeURIComponent(codigo);


  fetch(url)

    .then(response => {

      if (!response.ok) {

        throw new Error(
          "Error HTTP: " + response.status
        );

      }

      return response.json();

    })

    .then(data => {

      console.log(
        "Resultado consulta:",
        data
      );


      if (!data.correcto) {

        mensajePuntos.textContent =
          data.mensaje ||
          "No se pudo consultar los puntos.";

        return;
      }


      // Mostrar datos del cliente

      nombreCliente.textContent =
        data.cliente;

      cantidadPuntos.textContent =
        data.puntos;


      resultadoPuntos.style.display =
        "block";

      mensajePuntos.textContent =
        "";

    })

    .catch(error => {

      console.error(
        "Error consultando puntos:",
        error
      );

      mensajePuntos.textContent =
        "No se pudo conectar con el sistema de puntos. Inténtalo nuevamente.";

    });

}
