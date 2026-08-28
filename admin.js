// ==========================================================
// JUANITA PACASMAYO
// ADMIN.JS
// ==========================================================


// ==========================================================
// URL DE GOOGLE APPS SCRIPT
// ==========================================================

const URL_APPS_SCRIPT =
  "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";


// ==========================================================
// ELEMENTOS
// ==========================================================

const codigoRegistro =
  document.getElementById("codigoRegistro");

const btnBuscarCliente =
  document.getElementById("btnBuscarCliente");

const clienteRegistro =
  document.getElementById("clienteRegistro");

const nombreRegistro =
  document.getElementById("nombreRegistro");

const puntosRegistro =
  document.getElementById("puntosRegistro");

const tipoRegistro =
  document.getElementById("tipoRegistro");

const conceptoRegistro =
  document.getElementById("conceptoRegistro");

const montoRegistro =
  document.getElementById("montoRegistro");

const observacionRegistro =
  document.getElementById("observacionRegistro");

const btnRegistrarMovimiento =
  document.getElementById("btnRegistrarMovimiento");

const mensajeRegistro =
  document.getElementById("mensajeRegistro");

const resultadoRegistro =
  document.getElementById("resultadoRegistro");

const detalleRegistro =
  document.getElementById("detalleRegistro");


// ==========================================================
// FUNCIÓN PARA MOSTRAR MENSAJES
// ==========================================================

function mostrarMensaje(
  mensaje,
  tipo = "info"
) {

  if (!mensajeRegistro) {
    return;
  }

  mensajeRegistro.textContent =
    mensaje;

  mensajeRegistro.className =
    "mensaje-registro " + tipo;

}


// ==========================================================
// FUNCIÓN PARA LEER JSON
// ==========================================================
//
// Esta función evita el error:
// Unexpected token '<'
//
// Si Apps Script devuelve HTML,
// nos mostrará el contenido del problema.
//

async function leerRespuestaJSON(
  respuesta
) {

  const texto =
    await respuesta.text();


  // --------------------------------------------------------
  // Comprobar si parece HTML
  // --------------------------------------------------------

  if (
    texto.trim().startsWith("<")
  ) {

    console.error(
      "Apps Script devolvió HTML:",
      texto
    );

    throw new Error(
      "El servidor devolvió una página HTML en lugar de JSON. Revisa la URL del Web App de Apps Script y que la implementación esté activa."
    );

  }


  // --------------------------------------------------------
  // Convertir a JSON
  // --------------------------------------------------------

  try {

    return JSON.parse(texto);

  } catch (error) {

    console.error(
      "Respuesta recibida:",
      texto
    );

    throw new Error(
      "La respuesta de Apps Script no es un JSON válido."
    );

  }

}


// ==========================================================
// BUSCAR CLIENTE
// ==========================================================

async function buscarCliente() {

  const codigo =
    codigoRegistro.value
      .trim()
      .toUpperCase();


  // --------------------------------------------------------
  // Validar código
  // --------------------------------------------------------

  if (!codigo) {

    mostrarMensaje(
      "❌ Escribe el código del cliente.",
      "error"
    );

    return;

  }


  // --------------------------------------------------------
  // Mostrar estado
  // --------------------------------------------------------

  mostrarMensaje(
    "🔎 Buscando cliente...",
    "info"
  );


  clienteRegistro.style.display =
    "none";


  try {

    const url =
      URL_APPS_SCRIPT +
      "?accion=consultarPuntos" +
      "&codigo=" +
      encodeURIComponent(codigo);


    console.log(
      "Consultando:",
      url
    );


    const respuesta =
      await fetch(
        url,
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    console.log(
      "Respuesta consultarPuntos:",
      datos
    );


    // ------------------------------------------------------
    // Error del servidor
    // ------------------------------------------------------

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo consultar el cliente."
      );

    }


    // ------------------------------------------------------
    // Mostrar cliente
    // ------------------------------------------------------

    nombreRegistro.textContent =
      datos.cliente ||
      "Cliente";


    puntosRegistro.textContent =
      "⭐ " +
      Number(datos.puntos || 0) +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    mostrarMensaje(
      "✅ Cliente encontrado correctamente.",
      "exito"
    );


    // ------------------------------------------------------
    // Guardar código
    // ------------------------------------------------------

    codigoRegistro.value =
      datos.codigoCliente ||
      codigo;


  } catch (error) {

    console.error(
      "Error buscando cliente:",
      error
    );


    clienteRegistro.style.display =
      "none";


    mostrarMensaje(
      "❌ " + error.message,
      "error"
    );

  }

}


// ==========================================================
// REGISTRAR COMPRA / SERVICIO
// ==========================================================

async function registrarMovimiento() {

  const codigo =
    codigoRegistro.value
      .trim()
      .toUpperCase();


  const tipo =
    tipoRegistro.value;


  const concepto =
    conceptoRegistro.value;


  const monto =
    Number(
      montoRegistro.value
    );


  const observacion =
    observacionRegistro.value
      .trim();


  // --------------------------------------------------------
  // VALIDAR CLIENTE
  // --------------------------------------------------------

  if (!codigo) {

    mostrarMensaje(
      "❌ Primero escribe el código del cliente.",
      "error"
    );

    return;

  }


  // --------------------------------------------------------
  // VALIDAR MONTO
  // --------------------------------------------------------

  if (
    isNaN(monto) ||
    monto <= 0
  ) {

    mostrarMensaje(
      "❌ Ingresa un monto válido mayor que cero.",
      "error"
    );

    return;

  }


  // --------------------------------------------------------
  // Mostrar estado
  // --------------------------------------------------------

  mostrarMensaje(
    "⏳ Registrando movimiento...",
    "info"
  );


  btnRegistrarMovimiento.disabled =
    true;


  try {

    // ------------------------------------------------------
    // Crear URL
    // ------------------------------------------------------

    const parametros =
      new URLSearchParams({

        accion:
          "registrarMovimiento",

        codigo:
          codigo,

        tipo:
          tipo,

        concepto:
          concepto,

        monto:
          monto,

        observacion:
          observacion

      });


    const url =
      URL_APPS_SCRIPT +
      "?" +
      parametros.toString();


    console.log(
      "Registrando:",
      url
    );


    // ------------------------------------------------------
    // Enviar
    // ------------------------------------------------------

    const respuesta =
      await fetch(
        url,
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    console.log(
      "Respuesta registrarMovimiento:",
      datos
    );


    // ------------------------------------------------------
    // Comprobar respuesta
    // ------------------------------------------------------

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo registrar el movimiento."
      );

    }


    // ------------------------------------------------------
    // Mostrar resultado
    // ------------------------------------------------------

    resultadoRegistro.style.display =
      "block";


    detalleRegistro.innerHTML =

      "<strong>" +
      datos.cliente +
      "</strong>" +

      "<br><br>" +

      "Código: " +
      datos.codigoCliente +

      "<br>" +

      "💰 Monto: <strong>S/ " +
      Number(datos.monto).toFixed(2) +
      "</strong>" +

      "<br>" +

      "⭐ Puntos ganados: <strong>" +
      datos.puntosGanados +
      "</strong>" +

      "<br>" +

      "⭐ Puntos acumulados: <strong>" +
      datos.puntosTotales +
      "</strong>";


    mostrarMensaje(
      "✅ Compra / servicio registrado correctamente.",
      "exito"
    );


    // ------------------------------------------------------
    // Actualizar datos del cliente
    // ------------------------------------------------------

    nombreRegistro.textContent =
      datos.cliente;


    puntosRegistro.textContent =
      "⭐ " +
      datos.puntosTotales +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    // ------------------------------------------------------
    // Limpiar campos
    // ------------------------------------------------------

    montoRegistro.value =
      "";

    observacionRegistro.value =
      "";


    // ------------------------------------------------------
    // CARGAR HISTORIAL
    // ------------------------------------------------------

    cargarHistorial(
      codigo
    );


  } catch (error) {

    console.error(
      "Error registrando movimiento:",
      error
    );


    mostrarMensaje(
      "❌ " + error.message,
      "error"
    );

  } finally {

    btnRegistrarMovimiento.disabled =
      false;

  }

}


// ==========================================================
// CARGAR HISTORIAL
// ==========================================================

async function cargarHistorial(
  codigo
) {

  const contenedor =
    document.getElementById(
      "historialCliente"
    );


  if (!contenedor) {

    console.warn(
      "No existe el contenedor historialCliente."
    );

    return;

  }


  contenedor.innerHTML =
    "<p>⏳ Cargando historial...</p>";


  try {

    const url =
      URL_APPS_SCRIPT +
      "?accion=historialCliente" +
      "&codigo=" +
      encodeURIComponent(codigo);


    console.log(
      "Consultando historial:",
      url
    );


    const respuesta =
      await fetch(
        url,
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    console.log(
      "Historial recibido:",
      datos
    );


    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo cargar el historial."
      );

    }


    mostrarHistorial(
      datos
    );


  } catch (error) {

    console.error(
      "Error cargando historial:",
      error
    );


    contenedor.innerHTML =

      "<div class='historial-vacio'>" +

      "❌ No se pudo cargar el historial.<br><br>" +

      error.message +

      "</div>";

  }

}


// ==========================================================
// MOSTRAR HISTORIAL
// ==========================================================

function mostrarHistorial(
  datos
) {

  const contenedor =
    document.getElementById(
      "historialCliente"
    );


  if (!contenedor) {
    return;
  }


  const historial =
    Array.isArray(datos.historial)
      ? datos.historial
      : [];


  // --------------------------------------------------------
  // Sin movimientos
  // --------------------------------------------------------

  if (
    historial.length === 0
  ) {

    contenedor.innerHTML =

      "<div class='historial-vacio'>" +

      "📋 Este cliente todavía no tiene movimientos registrados." +

      "</div>";

    return;

  }


  // --------------------------------------------------------
  // Crear historial
  // --------------------------------------------------------

  let html = "";


  html +=

    "<div class='historial-header'>" +

      "<div>" +

        "<p class='section-kicker'>MOVIMIENTOS</p>" +

        "<h3>📋 Historial del cliente</h3>" +

      "</div>" +

      "<span class='total-movimientos'>" +

        historial.length +

        (
          historial.length === 1
            ? " movimiento"
            : " movimientos"
        ) +

      "</span>" +

    "</div>";


  html +=
    "<div class='historial-lista'>";


  historial.forEach(
    function(movimiento) {

      const monto =
        Number(
          movimiento.monto || 0
        );


      const puntos =
        Number(
          movimiento.puntos || 0
        );


      html +=

        "<div class='historial-item'>" +

          "<div class='historial-fecha'>" +

            "<strong>📅 " +

            escaparHTML(
              movimiento.fecha || "-"
            ) +

            "</strong>" +

            "<small>" +

            escaparHTML(
              movimiento.tipo || ""
            ) +

            "</small>" +

          "</div>" +


          "<div class='historial-concepto'>" +

            "<strong>" +

            escaparHTML(
              movimiento.concepto || "Sin concepto"
            ) +

            "</strong>" +

            (
              movimiento.observacion
                ? "<small>" +
                  escaparHTML(
                    movimiento.observacion
                  ) +
                  "</small>"
                : ""
            ) +

          "</div>" +


          "<div class='historial-monto'>" +

            "<strong>💰 S/ " +

            monto.toFixed(2) +

            "</strong>" +

          "</div>" +


          "<div class='historial-puntos'>" +

            "<strong>⭐ +" +

            puntos +

            " puntos</strong>" +

          "</div>" +

        "</div>";

    }
  );


  html +=
    "</div>";


  contenedor.innerHTML =
    html;

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escaparHTML(
  texto
) {

  return String(texto)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ==========================================================
// EVENTO BUSCAR
// ==========================================================

if (
  btnBuscarCliente
) {

  btnBuscarCliente.addEventListener(
    "click",
    buscarCliente
  );

}


// ==========================================================
// EVENTO REGISTRAR
// ==========================================================

if (
  btnRegistrarMovimiento
) {

  btnRegistrarMovimiento.addEventListener(
    "click",
    registrarMovimiento
  );

}


// ==========================================================
// ENTER EN CÓDIGO
// ==========================================================

if (
  codigoRegistro
) {

  codigoRegistro.addEventListener(
    "keydown",
    function(evento) {

      if (
        evento.key === "Enter"
      ) {

        evento.preventDefault();

        buscarCliente();

      }

    }
  );

}


// ==========================================================
// INICIO
// ==========================================================

console.log(
  "✅ admin.js cargado correctamente."
);
