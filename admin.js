// ======================================================
// JUANITA PACASMAYO
// ADMINISTRACIÓN - REGISTRO DE COMPRAS Y SERVICIOS
// ======================================================


// ======================================================
// URL DE GOOGLE APPS SCRIPT
// ======================================================

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// ======================================================
// INICIAR
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("✅ admin.js cargado correctamente");


  const btnBuscar =
    document.getElementById("btnBuscarCliente");

  const btnRegistrar =
    document.getElementById("btnRegistrarMovimiento");


  // ------------------------------------------
  // BOTÓN BUSCAR
  // ------------------------------------------

  if (btnBuscar) {

    btnBuscar.addEventListener(
      "click",
      buscarCliente
    );

  }


  // ------------------------------------------
  // BOTÓN REGISTRAR
  // ------------------------------------------

  if (btnRegistrar) {

    btnRegistrar.addEventListener(
      "click",
      registrarMovimiento
    );

  }


  // ------------------------------------------
  // ENTER EN CÓDIGO
  // ------------------------------------------

  const codigoInput =
    document.getElementById("codigoRegistro");

  if (codigoInput) {

    codigoInput.addEventListener(
      "keydown",
      function (e) {

        if (e.key === "Enter") {

          e.preventDefault();

          buscarCliente();

        }

      }
    );

  }

});


// ======================================================
// BUSCAR CLIENTE
// ======================================================

async function buscarCliente() {

  const codigoInput =
    document.getElementById("codigoRegistro");

  const clienteRegistro =
    document.getElementById("clienteRegistro");

  const nombreRegistro =
    document.getElementById("nombreRegistro");

  const puntosRegistro =
    document.getElementById("puntosRegistro");

  const mensajeRegistro =
    document.getElementById("mensajeRegistro");


  const codigo =
    codigoInput.value.trim();


  // ------------------------------------------
  // VALIDAR CÓDIGO
  // ------------------------------------------

  if (!codigo) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Ingresa el código del cliente.",
      "error"
    );

    clienteRegistro.style.display = "none";

    return;

  }


  // ------------------------------------------
  // MOSTRAR CARGANDO
  // ------------------------------------------

  mostrarMensaje(
    mensajeRegistro,
    "🔎 Buscando cliente...",
    "info"
  );


  try {

    const url =
      WEB_APP_URL +
      "?accion=consultarPuntos" +
      "&codigo=" +
      encodeURIComponent(codigo);


    console.log(
      "Consultando:",
      url
    );


    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta:",
      datos
    );


    // ------------------------------------------
    // ERROR
    // ------------------------------------------

    if (!datos.correcto) {

      clienteRegistro.style.display =
        "none";


      mostrarMensaje(
        mensajeRegistro,
        "❌ " +
        (
          datos.mensaje ||
          "No se encontró el cliente."
        ),
        "error"
      );

      return;

    }


    // ------------------------------------------
    // MOSTRAR CLIENTE
    // ------------------------------------------

    nombreRegistro.textContent =
      datos.cliente;


    puntosRegistro.textContent =
      "⭐ " +
      Number(datos.puntos || 0) +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    // Guardar código confirmado

    codigoInput.dataset.clienteEncontrado =
      datos.codigoCliente;


    mostrarMensaje(
      mensajeRegistro,
      "✅ Cliente encontrado correctamente.",
      "success"
    );


  } catch (error) {

    console.error(
      "Error buscando cliente:",
      error
    );


    clienteRegistro.style.display =
      "none";


    mostrarMensaje(
      mensajeRegistro,
      "❌ No se pudo conectar con Google Apps Script.",
      "error"
    );

  }

}


// ======================================================
// REGISTRAR MOVIMIENTO
// ======================================================

async function registrarMovimiento() {

  const codigoInput =
    document.getElementById("codigoRegistro");

  const tipoInput =
    document.getElementById("tipoRegistro");

  const conceptoInput =
    document.getElementById("conceptoRegistro");

  const montoInput =
    document.getElementById("montoRegistro");

  const observacionInput =
    document.getElementById("observacionRegistro");

  const clienteRegistro =
    document.getElementById("clienteRegistro");

  const nombreRegistro =
    document.getElementById("nombreRegistro");

  const puntosRegistro =
    document.getElementById("puntosRegistro");

  const mensajeRegistro =
    document.getElementById("mensajeRegistro");

  const resultadoRegistro =
    document.getElementById("resultadoRegistro");

  const detalleRegistro =
    document.getElementById("detalleRegistro");

  const btnRegistrar =
    document.getElementById(
      "btnRegistrarMovimiento"
    );


  // ==================================================
  // OBTENER DATOS
  // ==================================================

  const codigo =
    codigoInput.value.trim();


  const tipo =
    tipoInput.value.trim();


  const concepto =
    conceptoInput.value.trim();


  const monto =
    Number(montoInput.value);


  const observacion =
    observacionInput.value.trim();


  // ==================================================
  // VALIDAR CLIENTE
  // ==================================================

  if (!codigo) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Ingresa el código del cliente.",
      "error"
    );

    return;

  }


  // ==================================================
  // OBLIGAR A BUSCAR CLIENTE
  // ==================================================

  if (
    codigoInput.dataset.clienteEncontrado !==
    codigo
  ) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Primero pulsa «Buscar» y verifica el cliente.",
      "error"
    );

    return;

  }


  // ==================================================
  // VALIDAR TIPO
  // ==================================================

  if (!tipo) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Selecciona el tipo de movimiento.",
      "error"
    );

    return;

  }


  // ==================================================
  // VALIDAR CONCEPTO
  // ==================================================

  if (!concepto) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Selecciona el servicio o concepto.",
      "error"
    );

    return;

  }


  // ==================================================
  // VALIDAR MONTO
  // ==================================================

  if (
    isNaN(monto) ||
    monto <= 0
  ) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Ingresa un monto válido mayor que 0.",
      "error"
    );

    montoInput.focus();

    return;

  }


  // ==================================================
  // DESACTIVAR BOTÓN
  // ==================================================

  btnRegistrar.disabled =
    true;

  const textoOriginal =
    btnRegistrar.innerHTML;

  btnRegistrar.innerHTML =
    "⏳ Registrando...";


  mostrarMensaje(
    mensajeRegistro,
    "⏳ Registrando compra o servicio...",
    "info"
  );


  // ==================================================
  // PREPARAR DATOS
  // ==================================================

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


  try {

    // ==================================================
    // ENVIAR A GOOGLE APPS SCRIPT
    // ==================================================

    const url =
      WEB_APP_URL +
      "?" +
      parametros.toString();


    console.log(
      "Registrando:",
      url
    );


    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta registro:",
      datos
    );


    // ==================================================
    // COMPROBAR RESPUESTA
    // ==================================================

    if (!datos.correcto) {

      mostrarMensaje(
        mensajeRegistro,
        "❌ " +
        (
          datos.mensaje ||
          "No se pudo registrar el movimiento."
        ),
        "error"
      );

      return;

    }


    // ==================================================
    // REGISTRO CORRECTO
    // ==================================================

    mostrarMensaje(
      mensajeRegistro,
      "✅ Movimiento registrado correctamente.",
      "success"
    );


    // ==================================================
    // MOSTRAR RESULTADO
    // ==================================================

    detalleRegistro.innerHTML = `

      <strong>
        ${escaparHTML(datos.cliente)}
      </strong>

      <br>

      Código:
      ${escaparHTML(datos.codigoCliente)}

      <br><br>

      💰 Monto:
      <strong>
        S/ ${Number(datos.monto).toFixed(2)}
      </strong>

      <br>

      ⭐ Puntos ganados:
      <strong>
        ${Number(datos.puntosGanados)}
      </strong>

      <br>

      ⭐ Puntos acumulados:
      <strong>
        ${Number(datos.puntosTotales)}
      </strong>

    `;


    resultadoRegistro.style.display =
      "block";


    // ==================================================
    // ACTUALIZAR PUNTOS DEL CLIENTE
    // ==================================================

    puntosRegistro.textContent =
      "⭐ " +
      Number(datos.puntosTotales) +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    // ==================================================
    // LIMPIAR CAMPOS
    // ==================================================

    montoInput.value =
      "";

    observacionInput.value =
      "";


    // ==================================================
    // MANTENER CLIENTE SELECCIONADO
    // ==================================================

    codigoInput.dataset.clienteEncontrado =
      datos.codigoCliente;


  } catch (error) {

    console.error(
      "Error registrando movimiento:",
      error
    );


    mostrarMensaje(
      mensajeRegistro,
      "❌ Error de conexión con Google Apps Script.",
      "error"
    );


  } finally {

    // ==================================================
    // ACTIVAR BOTÓN
    // ==================================================

    btnRegistrar.disabled =
      false;

    btnRegistrar.innerHTML =
      textoOriginal;

  }

}


// ======================================================
// MOSTRAR MENSAJES
// ======================================================

function mostrarMensaje(
  elemento,
  mensaje,
  tipo
) {

  if (!elemento) {
    return;
  }


  elemento.innerHTML =
    mensaje;


  elemento.className =
    "mensaje-registro " +
    "mensaje-" +
    (tipo || "info");

}


// ======================================================
// PROTEGER TEXTO
// ======================================================

function escaparHTML(valor) {

  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
