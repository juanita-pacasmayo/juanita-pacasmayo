// ==========================================================
// JUANITA PACASMAYO
// ADMIN.JS
// REGISTRO DE COMPRAS / SERVICIOS + HISTORIAL
// ==========================================================


// ==========================================================
// URL DE GOOGLE APPS SCRIPT
// ==========================================================

const URL_APPS_SCRIPT =
  "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";


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
// VARIABLE DEL CLIENTE ACTUAL
// ==========================================================

let clienteActual = null;


// ==========================================================
// MENSAJES
// ==========================================================

function mostrarMensaje(texto, tipo = "info") {

  if (!mensajeRegistro) {
    return;
  }

  mensajeRegistro.textContent = texto;

  mensajeRegistro.className =
    "mensaje-registro " + tipo;

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escaparHTML(texto) {

  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ==========================================================
// BUSCAR CLIENTE
// ==========================================================

async function buscarCliente() {

  const codigo =
    codigoRegistro.value.trim();


  if (!codigo) {

    mostrarMensaje(
      "Escribe el código del cliente.",
      "error"
    );

    clienteRegistro.style.display = "none";

    clienteActual = null;

    return;
  }


  mostrarMensaje(
    "🔎 Buscando cliente...",
    "info"
  );


  btnBuscarCliente.disabled = true;


  try {

    const url =
      URL_APPS_SCRIPT +
      "?accion=consultarPuntos" +
      "&codigo=" +
      encodeURIComponent(codigo);


    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta buscar cliente:",
      datos
    );


    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se encontró el cliente."
      );

    }


    // ------------------------------------------------------
    // GUARDAR CLIENTE
    // ------------------------------------------------------

    clienteActual = datos;


    // ------------------------------------------------------
    // MOSTRAR INFORMACIÓN
    // ------------------------------------------------------

    nombreRegistro.textContent =
      datos.cliente || "Cliente";


    puntosRegistro.textContent =
      "⭐ " +
      Number(datos.puntos || 0) +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    mostrarMensaje(
      "✅ Cliente encontrado correctamente.",
      "success"
    );


    // Ocultar resultado anterior
    resultadoRegistro.style.display =
      "none";


  } catch (error) {

    console.error(
      "Error al buscar cliente:",
      error
    );


    clienteActual = null;


    clienteRegistro.style.display =
      "none";


    mostrarMensaje(
      "❌ " + error.message,
      "error"
    );


  } finally {

    btnBuscarCliente.disabled =
      false;

  }

}


// ==========================================================
// REGISTRAR MOVIMIENTO
// ==========================================================

async function registrarMovimiento() {

  // --------------------------------------------------------
  // VALIDAR CLIENTE
  // --------------------------------------------------------

  const codigo =
    codigoRegistro.value.trim();


  if (!codigo) {

    mostrarMensaje(
      "Primero escribe el código del cliente.",
      "error"
    );

    return;

  }


  // --------------------------------------------------------
  // SI TODAVÍA NO SE BUSCÓ EL CLIENTE
  // --------------------------------------------------------

  if (
    !clienteActual ||
    String(clienteActual.codigoCliente).trim() !== codigo
  ) {

    await buscarCliente();


    if (!clienteActual) {

      return;

    }

  }


  // --------------------------------------------------------
  // DATOS DEL FORMULARIO
  // --------------------------------------------------------

  const tipo =
    tipoRegistro.value;


  const concepto =
    conceptoRegistro.value;


  const monto =
    Number(montoRegistro.value);


  const observacion =
    observacionRegistro.value.trim();


  // --------------------------------------------------------
  // VALIDAR MONTO
  // --------------------------------------------------------

  if (
    isNaN(monto) ||
    monto <= 0
  ) {

    mostrarMensaje(
      "Ingresa un monto válido mayor que cero.",
      "error"
    );

    montoRegistro.focus();

    return;

  }


  // --------------------------------------------------------
  // PREPARAR BOTÓN
  // --------------------------------------------------------

  btnRegistrarMovimiento.disabled =
    true;


  btnRegistrarMovimiento.textContent =
    "⏳ Registrando...";


  mostrarMensaje(
    "Registrando compra o servicio...",
    "info"
  );


  // Ocultar resultado anterior
  resultadoRegistro.style.display =
    "none";


  try {

    // ------------------------------------------------------
    // CREAR URL
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
      "URL registro:",
      url
    );


    // ------------------------------------------------------
    // ENVIAR A APPS SCRIPT
    // ------------------------------------------------------

    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta registrar:",
      datos
    );


    // ------------------------------------------------------
    // ERROR
    // ------------------------------------------------------

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo registrar el movimiento."
      );

    }


    // ------------------------------------------------------
    // MOSTRAR MENSAJE
    // ------------------------------------------------------

    mostrarMensaje(
      "✅ Movimiento registrado correctamente.",
      "success"
    );


    // ------------------------------------------------------
    // MOSTRAR RESULTADO
    // ------------------------------------------------------

    resultadoRegistro.style.display =
      "block";


    detalleRegistro.innerHTML = `

      <strong>
        ${escaparHTML(datos.cliente)}
      </strong>

      <br>

      Código:
      <strong>
        ${escaparHTML(datos.codigoCliente)}
      </strong>

      <br><br>

      💰 Monto:
      <strong>
        S/ ${Number(datos.monto || 0).toFixed(2)}
      </strong>

      <br>

      ⭐ Puntos ganados:
      <strong>
        ${Number(datos.puntosGanados || 0)}
      </strong>

      <br>

      ⭐ Puntos acumulados:
      <strong>
        ${Number(datos.puntosTotales || 0)}
      </strong>

    `;


    // ------------------------------------------------------
    // ACTUALIZAR PUNTOS DEL CLIENTE
    // ------------------------------------------------------

    puntosRegistro.textContent =
      "⭐ " +
      Number(datos.puntosTotales || 0) +
      " puntos";


    // Actualizar cliente actual
    clienteActual.puntos =
      Number(datos.puntosTotales || 0);


    // ------------------------------------------------------
    // LIMPIAR FORMULARIO
    // ------------------------------------------------------

    montoRegistro.value = "";

    observacionRegistro.value = "";


    // ------------------------------------------------------
    // ACTUALIZAR HISTORIAL
    // ------------------------------------------------------

    await cargarHistorial(codigo);


  } catch (error) {

    console.error(
      "Error al registrar:",
      error
    );


    mostrarMensaje(
      "❌ " + error.message,
      "error"
    );


  } finally {

    btnRegistrarMovimiento.disabled =
      false;


    btnRegistrarMovimiento.textContent =
      "🧾 Registrar compra / servicio";

  }

}


// ==========================================================
// CARGAR HISTORIAL
// ==========================================================

async function cargarHistorial(codigo) {

  const historialContenedor =
    document.getElementById(
      "historialRegistro"
    );


  if (!historialContenedor) {

    console.warn(
      "No existe el elemento #historialRegistro en admin.html"
    );

    return;

  }


  historialContenedor.innerHTML = `

    <div class="historial-cargando">
      ⏳ Cargando historial...
    </div>

  `;


  try {

    const url =
      URL_APPS_SCRIPT +
      "?accion=historialCliente" +
      "&codigo=" +
      encodeURIComponent(codigo);


    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta historial:",
      datos
    );


    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo obtener el historial."
      );

    }


    mostrarHistorial(
      datos.historial || []
    );


  } catch (error) {

    console.error(
      "Error historial:",
      error
    );


    historialContenedor.innerHTML = `

      <div class="historial-error">

        ❌ No se pudo cargar el historial.

        <br>

        <small>
          ${escaparHTML(error.message)}
        </small>

      </div>

    `;

  }

}


// ==========================================================
// MOSTRAR HISTORIAL
// ==========================================================

function mostrarHistorial(historial) {

  const contenedor =
    document.getElementById(
      "historialRegistro"
    );


  if (!contenedor) {

    return;

  }


  // --------------------------------------------------------
  // SIN MOVIMIENTOS
  // --------------------------------------------------------

  if (!historial.length) {

    contenedor.innerHTML = `

      <div class="historial-vacio">

        <div class="historial-vacio-icono">
          📋
        </div>

        <strong>
          Aún no hay movimientos
        </strong>

        <p>
          Los registros de compras y servicios
          aparecerán aquí.
        </p>

      </div>

    `;

    return;

  }


  // --------------------------------------------------------
  // CREAR TARJETAS
  // --------------------------------------------------------

  let html = "";


  historial.forEach(function(movimiento) {

    const monto =
      Number(movimiento.monto || 0);


    const puntos =
      Number(movimiento.puntos || 0);


    const tipo =
      movimiento.tipo || "Movimiento";


    const concepto =
      movimiento.concepto || "Sin concepto";


    const fecha =
      movimiento.fecha || "";


    const observacion =
      movimiento.observacion || "";


    html += `

      <div class="historial-item">

        <div class="historial-icono">

          ${
            tipo.toLowerCase() === "compra"
              ? "🛍️"
              : "💇"
          }

        </div>


        <div class="historial-info">

          <div class="historial-titulo">

            <strong>
              ${escaparHTML(concepto)}
            </strong>

            <span class="historial-tipo">
              ${escaparHTML(tipo)}
            </span>

          </div>


          <div class="historial-fecha">

            📅 ${escaparHTML(fecha)}

          </div>


          ${
            observacion
              ? `
                <div class="historial-observacion">
                  ${escaparHTML(observacion)}
                </div>
              `
              : ""
          }

        </div>


        <div class="historial-datos">

          <strong>
            S/ ${monto.toFixed(2)}
          </strong>

          <span>
            +${puntos} puntos
          </span>

        </div>

      </div>

    `;

  });


  contenedor.innerHTML =
    html;

}


// ==========================================================
// EVENTO: BOTÓN BUSCAR
// ==========================================================

if (btnBuscarCliente) {

  btnBuscarCliente.addEventListener(
    "click",
    buscarCliente
  );

}


// ==========================================================
// EVENTO: BOTÓN REGISTRAR
// ==========================================================

if (btnRegistrarMovimiento) {

  btnRegistrarMovimiento.addEventListener(
    "click",
    registrarMovimiento
  );

}


// ==========================================================
// BUSCAR CON ENTER
// ==========================================================

if (codigoRegistro) {

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
// CARGAR HISTORIAL AL ENCONTRAR CLIENTE
// ==========================================================

async function cargarClienteEHistorial() {

  await buscarCliente();


  if (
    clienteActual &&
    clienteActual.codigoCliente
  ) {

    await cargarHistorial(
      clienteActual.codigoCliente
    );

  }

}


// ==========================================================
// FIN
// ==========================================================

console.log(
  "✅ admin.js cargado correctamente"
);
