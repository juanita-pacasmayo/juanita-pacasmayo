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
// ELEMENTOS - REGISTRAR MOVIMIENTO
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
// ELEMENTOS - REGISTRAR CLIENTE
// ==========================================================

const formularioCliente =
  document.getElementById("formularioCliente");

const btnRegistrarCliente =
  document.getElementById("btnRegistrarCliente");

const nombreCliente =
  document.getElementById("nombreCliente");

const telefonoCliente =
  document.getElementById("telefonoCliente");

const pinCliente =
  document.getElementById("pinCliente");

const estadoCliente =
  document.getElementById("estadoCliente");

const mensajeCliente =
  document.getElementById("mensajeCliente");

const resultadoCliente =
  document.getElementById("resultadoCliente");


// ==========================================================
// ELEMENTOS - HISTORIAL
// ==========================================================

const historialClienteHTML =
  document.getElementById("historialCliente");

const historialRegistro =
  document.getElementById("historialRegistro");

const historialBody =
  document.getElementById("historialBody");

const historialVacio =
  document.getElementById("historialVacio");

const totalMovimientos =
  document.getElementById("totalMovimientos");


// ==========================================================
// MOSTRAR MENSAJE DE MOVIMIENTO
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
// MOSTRAR MENSAJE DE CLIENTE
// ==========================================================

function mostrarMensajeCliente(
  mensaje,
  tipo = "info"
) {

  if (!mensajeCliente) {
    return;
  }

  mensajeCliente.textContent =
    mensaje;

  mensajeCliente.className =
    "mensaje-registro " + tipo;

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
  // Comprobar respuesta vacía
  // --------------------------------------------------------

  if (!texto || !texto.trim()) {

    throw new Error(
      "El servidor no devolvió ninguna respuesta."
    );

  }


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
  // Convertir JSON
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
// CREAR URL DE CONSULTA
// ==========================================================

function crearURL(
  parametros
) {

  return (
    URL_APPS_SCRIPT +
    "?" +
    parametros.toString()
  );

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escaparHTML(
  texto
) {

  return String(
    texto ?? ""
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
// FORMATEAR DINERO
// ==========================================================

function formatearMonto(
  monto
) {

  return (
    "S/ " +
    Number(
      monto || 0
    ).toFixed(2)
  );

}


// ==========================================================
// FORMATEAR PUNTOS
// ==========================================================

function formatearPuntos(
  puntos
) {

  return (
    Number(
      puntos || 0
    ).toLocaleString("es-PE") +
    " puntos"
  );

}


// ==========================================================
// BUSCAR CLIENTE
// ==========================================================

async function buscarCliente() {

  if (!codigoRegistro) {

    console.warn(
      "No existe #codigoRegistro"
    );

    return;

  }


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

    codigoRegistro.focus();

    return;

  }


  // --------------------------------------------------------
  // Estado
  // --------------------------------------------------------

  mostrarMensaje(
    "🔎 Buscando cliente...",
    "info"
  );


  if (clienteRegistro) {

    clienteRegistro.style.display =
      "none";

  }


  if (resultadoRegistro) {

    resultadoRegistro.style.display =
      "none";

  }


  try {

    const parametros =
      new URLSearchParams();

    parametros.append(
      "accion",
      "consultarPuntos"
    );

    parametros.append(
      "codigo",
      codigo
    );


    const url =
      crearURL(
        parametros
      );


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
    // Error
    // ------------------------------------------------------

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se encontró el cliente."
      );

    }


    // ------------------------------------------------------
    // Mostrar cliente
    // ------------------------------------------------------

    if (nombreRegistro) {

      nombreRegistro.textContent =
        datos.cliente ||
        "Cliente";

    }


    if (puntosRegistro) {

      puntosRegistro.textContent =
        "⭐ " +
        Number(
          datos.puntos || 0
        ) +
        " puntos";

    }


    if (clienteRegistro) {

      clienteRegistro.style.display =
        "flex";

    }


    codigoRegistro.value =
      datos.codigoCliente ||
      codigo;


    mostrarMensaje(
      "✅ Cliente encontrado correctamente.",
      "exito"
    );


    // ------------------------------------------------------
    // Cargar historial
    // ------------------------------------------------------

    await cargarHistorial(
      datos.codigoCliente ||
      codigo
    );


  } catch (error) {

    console.error(
      "Error buscando cliente:",
      error
    );


    if (clienteRegistro) {

      clienteRegistro.style.display =
        "none";

    }


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

  if (!codigoRegistro) {
    return;
  }


  const codigo =
    codigoRegistro.value
      .trim()
      .toUpperCase();


  const tipo =
    tipoRegistro
      ? tipoRegistro.value
      : "Servicio";


  const concepto =
    conceptoRegistro
      ? conceptoRegistro.value
      : "Otro";


  const monto =
    montoRegistro
      ? Number(
          montoRegistro.value
        )
      : 0;


  const observacion =
    observacionRegistro
      ? observacionRegistro.value.trim()
      : "";


  // --------------------------------------------------------
  // Validar código
  // --------------------------------------------------------

  if (!codigo) {

    mostrarMensaje(
      "❌ Primero escribe el código del cliente.",
      "error"
    );

    codigoRegistro.focus();

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

    if (montoRegistro) {
      montoRegistro.focus();
    }

    return;

  }


  // --------------------------------------------------------
  // Estado
  // --------------------------------------------------------

  mostrarMensaje(
    "⏳ Registrando movimiento...",
    "info"
  );


  if (btnRegistrarMovimiento) {

    btnRegistrarMovimiento.disabled =
      true;

  }


  try {

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


    const url =
      crearURL(
        parametros
      );


    console.log(
      "Registrando movimiento:",
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


    // ------------------------------------------------------
    // Mostrar resultado
    // ------------------------------------------------------

    if (resultadoRegistro) {

      resultadoRegistro.style.display =
        "block";

    }


    if (detalleRegistro) {

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

        "💰 Monto: <strong>" +
        formatearMonto(
          datos.monto
        ) +
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

    }


    mostrarMensaje(
      "✅ Compra / servicio registrado correctamente.",
      "exito"
    );


    // ------------------------------------------------------
    // Actualizar información cliente
    // ------------------------------------------------------

    if (nombreRegistro) {

      nombreRegistro.textContent =
        datos.cliente;

    }


    if (puntosRegistro) {

      puntosRegistro.textContent =
        "⭐ " +
        Number(
          datos.puntosTotales || 0
        ) +
        " puntos";

    }


    if (clienteRegistro) {

      clienteRegistro.style.display =
        "flex";

    }


    // ------------------------------------------------------
    // Limpiar campos
    // ------------------------------------------------------

    if (montoRegistro) {

      montoRegistro.value =
        "";

    }


    if (observacionRegistro) {

      observacionRegistro.value =
        "";

    }


    // ------------------------------------------------------
    // Actualizar historial
    // ------------------------------------------------------

    await cargarHistorial(
      datos.codigoCliente
    );


    // ------------------------------------------------------
    // Ir al historial
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

    if (btnRegistrarMovimiento) {

      btnRegistrarMovimiento.disabled =
        false;

    }

  }

}


// ==========================================================
// CARGAR HISTORIAL
// ==========================================================

async function cargarHistorial(
  codigo
) {

  if (!codigo) {
    return;
  }


  const contenedor =
    obtenerContenedorHistorial();


  if (!contenedor) {
    return;
  }


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

    const parametros =
      new URLSearchParams();


    parametros.append(
      "accion",
      "historialCliente"
    );


    parametros.append(
      "codigo",
      codigo
    );


    const url =
      crearURL(
        parametros
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
// OBTENER CONTENEDOR HISTORIAL
// ==========================================================

function obtenerContenedorHistorial() {

  let contenedor =
    document.getElementById(
      "historialCliente"
    );


  // --------------------------------------------------------
  // Si existe
  // --------------------------------------------------------

  if (contenedor) {

    return contenedor;

  }


  // --------------------------------------------------------
  // Buscar otro contenedor existente
  // --------------------------------------------------------

  contenedor =
    document.getElementById(
      "historialRegistro"
    );


  if (contenedor) {

    return contenedor;

  }


  // --------------------------------------------------------
  // Crear uno nuevo
  // --------------------------------------------------------

  contenedor =
    document.createElement(
      "div"
    );


  contenedor.id =
    "historialCliente";


  contenedor.className =
    "historial-cliente";


  const formulario =
    document.querySelector(
      ".admin-form"
    );


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
// MOSTRAR HISTORIAL
// ==========================================================

function mostrarHistorial(
  datos
) {

  const contenedor =
    obtenerContenedorHistorial();


  if (!contenedor) {
    return;
  }


  const historial =
    Array.isArray(
      datos.historial
    )
      ? datos.historial
      : [];


  // --------------------------------------------------------
  // Encabezado
  // --------------------------------------------------------

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


  // --------------------------------------------------------
  // Sin movimientos
  // --------------------------------------------------------

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


    actualizarTotalMovimientos(
      0
    );


    return;

  }


  // --------------------------------------------------------
  // Lista
  // --------------------------------------------------------

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


      html +=

        "<div class='historial-item'>" +

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


          "<div class='historial-monto'>" +

            "<span>💰</span>" +

            "<strong>" +

              formatearMonto(
                monto
              ) +

            "</strong>" +

          "</div>" +


          "<div class='historial-puntos'>" +

            "<span>⭐</span>" +

            "<strong>+" +

              puntos +

              " puntos" +

            "</strong>" +

          "</div>" +

        "</div>";

    }
  );


  html +=
    "</div>";


  contenedor.innerHTML =
    html;


  actualizarTotalMovimientos(
    historial.length
  );

}


// ==========================================================
// ACTUALIZAR TOTAL DE MOVIMIENTOS
// ==========================================================

function actualizarTotalMovimientos(
  cantidad
) {

  const elementos =
    document.querySelectorAll(
      ".total-movimientos"
    );


  elementos.forEach(
    function(elemento) {

      elemento.textContent =
        cantidad +
        (
          cantidad === 1
            ? " movimiento"
            : " movimientos"
        );

    }
  );

}


// ==========================================================
// REGISTRAR CLIENTE
// ==========================================================

async function registrarCliente() {

  // --------------------------------------------------------
  // Verificar elementos
  // --------------------------------------------------------

  if (
    !nombreCliente
  ) {

    console.error(
      "No se encontró #nombreCliente en admin.html"
    );

    return;

  }


  // --------------------------------------------------------
  // Obtener valores
  // --------------------------------------------------------

  const nombre =
    nombreCliente.value
      .trim();


  const telefono =
    telefonoCliente
      ? telefonoCliente.value.trim()
      : "";


  const pin =
    pinCliente
      ? pinCliente.value.trim()
      : "";


  const estado =
    estadoCliente
      ? estadoCliente.value
      : "Activo";


  // --------------------------------------------------------
  // Validar nombre
  // --------------------------------------------------------

  if (!nombre) {

    mostrarMensajeCliente(
      "❌ Ingresa el nombre del cliente.",
      "error"
    );

    nombreCliente.focus();

    return;

  }


  // --------------------------------------------------------
  // Validar teléfono
  // --------------------------------------------------------

  if (!telefono) {

    mostrarMensajeCliente(
      "❌ Ingresa el número de teléfono.",
      "error"
    );

    if (telefonoCliente) {
      telefonoCliente.focus();
    }

    return;

  }


  // --------------------------------------------------------
  // Validar PIN
  // --------------------------------------------------------

  if (
    pin &&
    !/^\d+$/.test(pin)
  ) {

    mostrarMensajeCliente(
      "❌ El PIN debe contener solamente números.",
      "error"
    );

    if (pinCliente) {
      pinCliente.focus();
    }

    return;

  }


  // --------------------------------------------------------
  // Estado
  // --------------------------------------------------------

  mostrarMensajeCliente(
    "⏳ Registrando cliente...",
    "info"
  );


  if (btnRegistrarCliente) {

    btnRegistrarCliente.disabled =
      true;

  }


  try {

    // ------------------------------------------------------
    // Parámetros
    // ------------------------------------------------------

    const parametros =
      new URLSearchParams();


    parametros.append(
      "accion",
      "registrarCliente"
    );


    parametros.append(
      "nombre",
      nombre
    );


    parametros.append(
      "telefono",
      telefono
    );


    parametros.append(
      "pin",
      pin
    );


    parametros.append(
      "estado",
      estado
    );


    // ------------------------------------------------------
    // URL
    // ------------------------------------------------------

    const url =
      crearURL(
        parametros
      );


    console.log(
      "Registrando cliente:",
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
      "Respuesta registrar cliente:",
      datos
    );


    // ------------------------------------------------------
    // Comprobar respuesta
    // ------------------------------------------------------

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo registrar el cliente."
      );

    }


    // ======================================================
    // CLIENTE REGISTRADO
    // ======================================================

    mostrarMensajeCliente(
      "✅ Cliente registrado correctamente.",
      "exito"
    );


    // ------------------------------------------------------
    // Mostrar resultado
    // ------------------------------------------------------

    if (resultadoCliente) {

      resultadoCliente.style.display =
        "block";


      resultadoCliente.innerHTML =

        "<div class='resultado-icono'>🎉</div>" +

        "<h3>Cliente registrado</h3>" +

        "<p>" +

          "<strong>" +

            escaparHTML(
              datos.cliente ||
              nombre
            ) +

          "</strong>" +

          "<br>" +

          "Código del cliente: " +

          "<strong>" +

            escaparHTML(
              datos.codigoCliente ||
              ""
            ) +

          "</strong>" +

          "<br>" +

          "⭐ Puntos iniciales: " +

          "<strong>" +

            Number(
              datos.puntos ||
              0
            ) +

          "</strong>" +

        "</p>";

    }


    // ------------------------------------------------------
    // Limpiar formulario
    // ------------------------------------------------------

    nombreCliente.value =
      "";


    if (telefonoCliente) {

      telefonoCliente.value =
        "";

    }


    if (pinCliente) {

      pinCliente.value =
        "";

    }


    // ------------------------------------------------------
    // Si se recibió código, cargarlo en
    // el formulario de movimientos
    // ------------------------------------------------------

    if (
      datos.codigoCliente &&
      codigoRegistro
    ) {

      codigoRegistro.value =
        datos.codigoCliente;


      // Mostrar automáticamente cliente
      // sin necesidad de buscar nuevamente

      if (nombreRegistro) {

        nombreRegistro.textContent =
          datos.cliente ||
          nombre;

      }


      if (puntosRegistro) {

        puntosRegistro.textContent =
          "⭐ " +
          Number(
            datos.puntos ||
            0
          ) +
          " puntos";

      }


      if (clienteRegistro) {

        clienteRegistro.style.display =
          "flex";

      }


      await cargarHistorial(
        datos.codigoCliente
      );

    }


  } catch (error) {

    console.error(
      "Error registrando cliente:",
      error
    );


    mostrarMensajeCliente(
      "❌ " +
      error.message,
      "error"
    );


  } finally {

    if (btnRegistrarCliente) {

      btnRegistrarCliente.disabled =
        false;

    }

  }

}


// ==========================================================
// LIMPIAR FORMULARIO CLIENTE
// ==========================================================

function limpiarFormularioCliente() {

  if (nombreCliente) {

    nombreCliente.value =
      "";

  }


  if (telefonoCliente) {

    telefonoCliente.value =
      "";

  }


  if (pinCliente) {

    pinCliente.value =
      "";

  }


  if (mensajeCliente) {

    mensajeCliente.textContent =
      "";

    mensajeCliente.className =
      "mensaje-registro";

  }


  if (resultadoCliente) {

    resultadoCliente.style.display =
      "none";

  }

}


// ==========================================================
// BOTÓN BUSCAR CLIENTE
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
// BOTÓN REGISTRAR MOVIMIENTO
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
// BOTÓN REGISTRAR CLIENTE
// ==========================================================

if (
  btnRegistrarCliente
) {

  btnRegistrarCliente.addEventListener(
    "click",
    registrarCliente
  );

}


// ==========================================================
// FORMULARIO REGISTRAR CLIENTE
// ==========================================================

if (
  formularioCliente
) {

  formularioCliente.addEventListener(
    "submit",
    function(evento) {

      evento.preventDefault();

      registrarCliente();

    }
  );

}


// ==========================================================
// ENTER EN CÓDIGO DEL CLIENTE
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
// ENTER / VALIDACIÓN TELÉFONO
// ==========================================================

if (
  telefonoCliente
) {

  telefonoCliente.addEventListener(
    "input",
    function() {

      // Permitir solamente números

      this.value =
        this.value.replace(
          /\D/g,
          ""
        );

    }
  );

}


// ==========================================================
// VALIDACIÓN PIN
// ==========================================================

if (
  pinCliente
) {

  pinCliente.addEventListener(
    "input",
    function() {

      this.value =
        this.value.replace(
          /\D/g,
          ""
        );

    }
  );

}


// ==========================================================
// MAYÚSCULAS AUTOMÁTICAS EN CÓDIGO
// ==========================================================

if (
  codigoRegistro
) {

  codigoRegistro.addEventListener(
    "input",
    function() {

      this.value =
        this.value.toUpperCase();

    }
  );

}


// ==========================================================
// OCULTAR RESULTADO AL EMPEZAR NUEVA BÚSQUEDA
// ==========================================================

if (
  codigoRegistro
) {

  codigoRegistro.addEventListener(
    "input",
    function() {

      if (resultadoRegistro) {

        resultadoRegistro.style.display =
          "none";

      }

      if (mensajeRegistro) {

        mensajeRegistro.textContent =
          "";

        mensajeRegistro.className =
          "mensaje-registro";

      }

    }
  );

}


// ==========================================================
// INICIO
// ==========================================================

console.log(
  "=========================================="
);

console.log(
  "✅ admin.js cargado correctamente."
);

console.log(
  "✅ Sistema de movimientos: listo"
);

console.log(
  "✅ Sistema de historial: listo"
);

console.log(
  "✅ Sistema de clientes: listo"
);

console.log(
  "=========================================="
);
