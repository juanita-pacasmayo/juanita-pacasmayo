// ==========================================================
// JUANITA PACASMAYO
// ADMIN.JS
// SISTEMA DE ADMINISTRACIÓN
// ==========================================================


// ==========================================================
// URL DE GOOGLE APPS SCRIPT
// ==========================================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// ==========================================================
// ELEMENTOS DEL HTML
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
// CREAR CONTENEDOR DEL HISTORIAL SI NO EXISTE
// ==========================================================

function obtenerContenedorHistorial() {

  let contenedor =
    document.getElementById("historialCliente");


  // --------------------------------------------------------
  // Si ya existe, utilizarlo
  // --------------------------------------------------------

  if (contenedor) {

    return contenedor;

  }


  // --------------------------------------------------------
  // Si no existe, crearlo automáticamente
  // --------------------------------------------------------

  contenedor =
    document.createElement("div");


  contenedor.id =
    "historialCliente";


  contenedor.className =
    "historial-cliente";


  // --------------------------------------------------------
  // Intentar colocarlo dentro del formulario
  // --------------------------------------------------------

  const formulario =
    document.querySelector(".admin-form");


  if (formulario) {

    formulario.appendChild(
      contenedor
    );

  } else {

    document.body.appendChild(
      contenedor
    );

  }


  return contenedor;

}


// ==========================================================
// MOSTRAR MENSAJE
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
    "mensaje-registro " +
    tipo;

}


// ==========================================================
// LEER RESPUESTA JSON
// ==========================================================

async function leerRespuestaJSON(
  respuesta
) {

  const texto =
    await respuesta.text();


  console.log(
    "Respuesta del servidor:",
    texto
  );


  // --------------------------------------------------------
  // Comprobar HTML
  // --------------------------------------------------------

  if (
    texto.trim().startsWith("<")
  ) {

    console.error(
      "Apps Script devolvió HTML:",
      texto
    );


    throw new Error(
      "Apps Script devolvió HTML en lugar de JSON. Verifica que estés usando la URL /exec de la implementación activa."
    );

  }


  // --------------------------------------------------------
  // Convertir a JSON
  // --------------------------------------------------------

  try {

    return JSON.parse(
      texto
    );

  } catch (error) {

    console.error(
      "JSON inválido:",
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
  // Validar
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
      "Consultando cliente:",
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
      "Cliente recibido:",
      datos
    );


    // ------------------------------------------------------
    // Comprobar error
    // ------------------------------------------------------

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se encontró el cliente."
      );

    }


    // ------------------------------------------------------
    // Mostrar información
    // ------------------------------------------------------

    nombreRegistro.textContent =
      datos.cliente ||
      "Cliente";


    puntosRegistro.textContent =
      "⭐ " +
      Number(
        datos.puntos || 0
      ) +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    codigoRegistro.value =
      datos.codigoCliente ||
      codigo;


    mostrarMensaje(
      "✅ Cliente encontrado correctamente.",
      "exito"
    );


    // ======================================================
    // CARGAR HISTORIAL AUTOMÁTICAMENTE
    // ======================================================

    await cargarHistorial(
      datos.codigoCliente ||
      codigo
    );


  } catch (error) {

    console.error(
      "Error buscando cliente:",
      error
    );


    clienteRegistro.style.display =
      "none";


    mostrarMensaje(
      "❌ " +
      error.message,
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
  // Validar código
  // --------------------------------------------------------

  if (!codigo) {

    mostrarMensaje(
      "❌ Primero escribe el código del cliente.",
      "error"
    );

    return;

  }


  // --------------------------------------------------------
  // Validar monto
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
  // Estado
  // --------------------------------------------------------

  mostrarMensaje(
    "⏳ Registrando movimiento...",
    "info"
  );


  btnRegistrarMovimiento.disabled =
    true;


  try {

    // ------------------------------------------------------
    // Parámetros
    // ------------------------------------------------------

    const parametros =
      new URLSearchParams();


    parametros.append(
      "accion",
      "registrarMovimiento"
    );


    parametros.append(
      "codigo",
      codigo
    );


    parametros.append(
      "tipo",
      tipo
    );


    parametros.append(
      "concepto",
      concepto
    );


    parametros.append(
      "monto",
      monto
    );


    parametros.append(
      "observacion",
      observacion
    );


    // ------------------------------------------------------
    // URL
    // ------------------------------------------------------

    const url =
      URL_APPS_SCRIPT +
      "?" +
      parametros.toString();


    console.log(
      "Registrando movimiento:",
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
      "Respuesta registrar:",
      datos
    );


    // ------------------------------------------------------
    // Comprobar
    // ------------------------------------------------------

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo registrar el movimiento."
      );

    }


    // ======================================================
    // MOSTRAR RESULTADO
    // ======================================================

    resultadoRegistro.style.display =
      "block";


    detalleRegistro.innerHTML =

      "<strong>" +
      escaparHTML(
        datos.cliente
      ) +
      "</strong>" +

      "<br><br>" +

      "Código: " +
      escaparHTML(
        datos.codigoCliente
      ) +

      "<br>" +

      "💰 Monto: <strong>S/ " +
      Number(
        datos.monto || 0
      ).toFixed(2) +
      "</strong>" +

      "<br>" +

      "⭐ Puntos ganados: <strong>" +
      Number(
        datos.puntosGanados || 0
      ) +
      "</strong>" +

      "<br>" +

      "⭐ Puntos acumulados: <strong>" +
      Number(
        datos.puntosTotales || 0
      ) +
      "</strong>";


    mostrarMensaje(
      "✅ Compra / servicio registrado correctamente.",
      "exito"
    );


    // ======================================================
    // ACTUALIZAR CLIENTE
    // ======================================================

    nombreRegistro.textContent =
      datos.cliente;


    puntosRegistro.textContent =
      "⭐ " +
      Number(
        datos.puntosTotales || 0
      ) +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    // ======================================================
    // LIMPIAR MONTO Y OBSERVACIÓN
    // ======================================================

    montoRegistro.value =
      "";


    observacionRegistro.value =
      "";


    // ======================================================
    // CARGAR HISTORIAL NUEVAMENTE
    // ======================================================

    await cargarHistorial(
      datos.codigoCliente
    );


    // ------------------------------------------------------
    // Llevar pantalla al historial
    // ------------------------------------------------------

    const historial =
      document.getElementById(
        "historialCliente"
      );


    if (historial) {

      historial.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }


  } catch (error) {

    console.error(
      "Error registrando movimiento:",
      error
    );


    mostrarMensaje(
      "❌ " +
      error.message,
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

  // --------------------------------------------------------
  // Obtener o crear contenedor
  // --------------------------------------------------------

  const contenedor =
    obtenerContenedorHistorial();


  // --------------------------------------------------------
  // Estado de carga
  // --------------------------------------------------------

  contenedor.innerHTML =

    "<div class='historial-cargando'>" +

      "<div class='historial-spinner'>⏳</div>" +

      "<strong>Consultando historial...</strong>" +

      "<p>Estamos buscando las compras y servicios del cliente.</p>" +

    "</div>";


  try {

    const url =
      URL_APPS_SCRIPT +
      "?accion=historialCliente" +
      "&codigo=" +
      encodeURIComponent(
        codigo
      );


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


    // ------------------------------------------------------
    // Error del servidor
    // ------------------------------------------------------

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo cargar el historial."
      );

    }


    // ------------------------------------------------------
    // Mostrar historial
    // ------------------------------------------------------

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

        "<div style='font-size:35px;'>⚠️</div>" +

        "<strong>No se pudo cargar el historial</strong>" +

        "<p>" +

        escaparHTML(
          error.message
        ) +

        "</p>" +

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
    obtenerContenedorHistorial();


  const historial =
    Array.isArray(
      datos.historial
    )
      ? datos.historial
      : [];


  // ========================================================
  // ENCABEZADO
  // ========================================================

  let html =

    "<div class='historial-header'>" +

      "<div>" +

        "<p class='section-kicker'>" +
        "MOVIMIENTOS" +
        "</p>" +

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


  // ========================================================
  // SIN MOVIMIENTOS
  // ========================================================

  if (
    historial.length === 0
  ) {

    html +=

      "<div class='historial-vacio'>" +

        "<div class='historial-vacio-icono'>" +
        "📋" +
        "</div>" +

        "<strong>Este cliente todavía no tiene movimientos.</strong>" +

        "<p>" +
        "Aquí aparecerán sus compras y servicios registrados." +
        "</p>" +

      "</div>";


    contenedor.innerHTML =
      html;


    return;

  }


  // ========================================================
  // LISTA DE MOVIMIENTOS
  // ========================================================

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


      const tipo =
        movimiento.tipo ||
        "Movimiento";


      const concepto =
        movimiento.concepto ||
        "Sin concepto";


      const fecha =
        movimiento.fecha ||
        "-";


      const observacion =
        movimiento.observacion ||
        "";


      // ----------------------------------------------------
      // ITEM
      // ----------------------------------------------------

      html +=

        "<div class='historial-item'>" +


          // ----------------------------------------------
          // FECHA
          // ----------------------------------------------

          "<div class='historial-fecha'>" +

            "<strong>📅 " +

              escaparHTML(
                fecha
              ) +

            "</strong>" +

            "<small>" +

              escaparHTML(
                tipo
              ) +

            "</small>" +

          "</div>" +


          // ----------------------------------------------
          // CONCEPTO
          // ----------------------------------------------

          "<div class='historial-concepto'>" +

            "<strong>" +

              escaparHTML(
                concepto
              ) +

            "</strong>" +

            (
              observacion
                ? "<small>" +
                  escaparHTML(
                    observacion
                  ) +
                  "</small>"
                : ""
            ) +

          "</div>" +


          // ----------------------------------------------
          // MONTO
          // ----------------------------------------------

          "<div class='historial-monto'>" +

            "<span>💰</span>" +

            "<strong>" +

              "S/ " +

              monto.toFixed(2) +

            "</strong>" +

          "</div>" +


          // ----------------------------------------------
          // PUNTOS
          // ----------------------------------------------

          "<div class='historial-puntos'>" +

            "<span>⭐</span>" +

            "<strong>" +

              "+" +

              puntos +

              " puntos" +

            "</strong>" +

          "</div>" +


        "</div>";

    }
  );


  html +=
    "</div>";


  // ========================================================
  // INSERTAR EN PANTALLA
  // ========================================================

  contenedor.innerHTML =
    html;

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escaparHTML(
  texto
) {

  return String(
    texto
  )

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
// BOTÓN BUSCAR
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
// BOTÓN REGISTRAR
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
