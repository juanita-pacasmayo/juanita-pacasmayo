```javascript
// ==========================================
// MENÚ PRINCIPAL
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", function () {

    mainNav.classList.toggle("open");

    const abierto = mainNav.classList.contains("open");

    menuToggle.setAttribute("aria-expanded", abierto);

  });

}


document.querySelectorAll(".main-nav a").forEach(function (enlace) {

  enlace.addEventListener("click", function () {

    if (mainNav) {
      mainNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

  });

});


// ==========================================
// CONEXIÓN CON APPS SCRIPT
// ==========================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


fetch(URL_APPS_SCRIPT)
  .then(function (response) {

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    return response.json();

  })
  .then(function (data) {

    console.log("Conexion Apps Script:", data);

  })
  .catch(function (error) {

    console.error("Error Apps Script:", error);

  });


// ==========================================
// ELEMENTOS DEL SISTEMA DE PUNTOS
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


// ==========================================
// BOTON CONSULTAR
// ==========================================

if (btnConsultarPuntos) {

  console.log("Boton de puntos encontrado");

  btnConsultarPuntos.addEventListener("click", function () {

    console.log("Boton CONSULTAR presionado");

    consultarPuntosWeb();

  });

} else {

  console.error("No se encontro btnConsultarPuntos");

}


// ==========================================
// FUNCION CONSULTAR PUNTOS
// ==========================================

function consultarPuntosWeb() {

  console.log("Ejecutando consultarPuntosWeb");

  const codigo =
    codigoClienteInput.value.trim().toUpperCase();


  // Limpiar resultado anterior

  mensajePuntos.textContent = "";

  resultadoPuntos.style.display = "none";


  // Validar codigo

  if (!codigo) {

    mensajePuntos.textContent =
      "Por favor, ingresa tu codigo de cliente.";

    return;

  }


  // Mostrar mensaje

  mensajePuntos.textContent =
    "Consultando tus puntos...";


  // Crear URL

  const url =
    URL_APPS_SCRIPT +
    "?accion=consultarPuntos&codigo=" +
    encodeURIComponent(codigo);


  console.log("Consultando URL:", url);


  // ==========================================
  // CONSULTAR APPS SCRIPT
  // ==========================================

  fetch(url)

    .then(function (response) {

      if (!response.ok) {

        throw new Error(
          "Error HTTP: " + response.status
        );

      }

      return response.json();

    })

    .then(function (data) {

      console.log("Respuesta puntos:", data);


      // Comprobar respuesta

      if (!data.correcto) {

        mensajePuntos.textContent =
          data.mensaje ||
          "No se pudo consultar los puntos.";

        return;

      }


      // Mostrar nombre

      nombreCliente.textContent =
        data.cliente;


      // Mostrar puntos

      cantidadPuntos.textContent =
        data.puntos;


      // Mostrar resultado

      resultadoPuntos.style.display =
        "block";


      mensajePuntos.textContent =
        "Puntos consultados correctamente.";


      // ==========================================
      // CONSULTAR PREMIOS
      // ==========================================

      consultarPremios(codigo);

    })

    .catch(function (error) {

      console.error(
        "Error consultando puntos:",
        error
      );

      mensajePuntos.textContent =
        "No se pudo conectar con el sistema de puntos.";

    });

}


// ==========================================
// CONSULTAR PREMIOS
// ==========================================

function consultarPremios(codigo) {

  console.log("Consultando premios...");


  const url =
    URL_APPS_SCRIPT +
    "?accion=premiosDisponibles&codigo=" +
    encodeURIComponent(codigo);


  fetch(url)

    .then(function (response) {

      if (!response.ok) {

        throw new Error(
          "Error HTTP premios: " +
          response.status
        );

      }

      return response.json();

    })

    .then(function (data) {

      console.log("Respuesta premios:", data);


      if (!data.correcto) {

        console.error(
          "Error premios:",
          data.mensaje
        );

        return;

      }


      mostrarPremios(data);

    })

    .catch(function (error) {

      console.error(
        "Error consultando premios:",
        error
      );

    });

}


// ==========================================
// MOSTRAR PREMIOS
// ==========================================

function mostrarPremios(data) {

  const listaPremios =
    document.querySelector(".premios-lista");


  if (!listaPremios) {

    console.error(
      "No existe .premios-lista en el HTML"
    );

    return;

  }


  // Limpiar premios

  listaPremios.innerHTML = "";


  // ==========================================
  // PREMIOS DISPONIBLES
  // ==========================================

  if (
    data.disponibles &&
    data.disponibles.length > 0
  ) {

    data.disponibles.forEach(function (premio) {

      const elemento =
        document.createElement("div");

      elemento.className =
        "premio premio-disponible";


      elemento.innerHTML =
        "<span>🎁</span>" +
        "<div>" +
        "<strong>" +
        premio.puntos +
        " puntos</strong>" +
        "<p>" +
        premio.nombre +
        "</p>" +
        "<small>Premio disponible</small>" +
        "</div>";


      listaPremios.appendChild(elemento);

    });

  }


  // ==========================================
  // PREMIOS BLOQUEADOS
  // ==========================================

  if (
    data.bloqueados &&
    data.bloqueados.length > 0
  ) {

    data.bloqueados.forEach(function (premio) {

      const elemento =
        document.createElement("div");

      elemento.className =
        "premio premio-bloqueado";


      elemento.innerHTML =
        "<span>🔒</span>" +
        "<div>" +
        "<strong>" +
        premio.puntos +
        " puntos</strong>" +
        "<p>" +
        premio.nombre +
        "</p>" +
        "<small>Te faltan " +
        premio.puntosFaltantes +
        " puntos</small>" +
        "</div>";


      listaPremios.appendChild(elemento);

    });

  }


  mensajePuntos.textContent = "";

}
```
