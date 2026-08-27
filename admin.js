// ======================================================
// JUANITA PACASMAYO - ADMINISTRACIÓN
// ======================================================

// URL DE TU WEB APP DE GOOGLE APPS SCRIPT
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// ======================================================
// ESPERAR A QUE CARGUE LA PÁGINA
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("✅ admin.js cargado correctamente");

  // ------------------------------------------
  // ELEMENTOS DEL FORMULARIO
  // ------------------------------------------

  const codigoInput =
    document.getElementById("codigoCliente");

  const buscarBtn =
    document.getElementById("buscarCliente");

  const formulario =
    document.getElementById("formRegistro");

  const resultadoCliente =
    document.getElementById("resultadoCliente");


  // ------------------------------------------
  // BOTÓN BUSCAR CLIENTE
  // ------------------------------------------

  if (buscarBtn) {

    buscarBtn.addEventListener("click", function () {

      buscarCliente();

    });

  }


  // ------------------------------------------
  // PERMITIR ENTER PARA BUSCAR
  // ------------------------------------------

  if (codigoInput) {

    codigoInput.addEventListener("keydown", function (e) {

      if (e.key === "Enter") {

        e.preventDefault();

        buscarCliente();

      }

    });

  }


  // ------------------------------------------
  // FORMULARIO DE REGISTRO
  // ------------------------------------------

  if (formulario) {

    formulario.addEventListener("submit", function (e) {

      e.preventDefault();

      registrarMovimiento();

    });

  }

});


// ======================================================
// BUSCAR CLIENTE
// ======================================================

async function buscarCliente() {

  const codigoInput =
    document.getElementById("codigoCliente");

  const resultadoCliente =
    document.getElementById("resultadoCliente");

  if (!codigoInput) {

    console.error(
      "No existe el campo codigoCliente"
    );

    return;

  }


  const codigo =
    codigoInput.value.trim();


  if (!codigo) {

    mostrarMensaje(
      resultadoCliente,
      "⚠️ Ingresa el código del cliente.",
      "error"
    );

    return;

  }


  mostrarMensaje(
    resultadoCliente,
    "🔎 Buscando cliente...",
    "info"
  );


  try {

    const url =
      WEB_APP_URL +
      "?accion=consultarPuntos" +
      "&codigo=" +
      encodeURIComponent(codigo);


    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta consultarPuntos:",
      datos
    );


    if (!datos.correcto) {

      mostrarMensaje(
        resultadoCliente,
        "❌ " +
        (datos.mensaje ||
          "No se encontró el cliente."),
        "error"
      );

      return;

    }


    // ------------------------------------------
    // MOSTRAR INFORMACIÓN DEL CLIENTE
    // ------------------------------------------

    resultadoCliente.innerHTML = `

      <div class="cliente-encontrado">

        <div class="cliente-icono">
          👤
        </div>

        <div class="cliente-datos">

          <strong>
            ${escaparHTML(datos.cliente)}
          </strong>

          <span>
            Código: ${escaparHTML(datos.codigoCliente)}
          </span>

          <span>
            ⭐ ${Number(datos.puntos) || 0} puntos
          </span>

          <span>
            Estado:
            ${escaparHTML(datos.estado || "Activo")}
          </span>

        </div>

      </div>

    `;


    // Guardamos el código encontrado
    codigoInput.dataset.clienteEncontrado =
      datos.codigoCliente;


  } catch (error) {

    console.error(
      "Error buscando cliente:",
      error
    );


    mostrarMensaje(
      resultadoCliente,
      "❌ No se pudo conectar con el sistema.",
      "error"
    );

  }

}


// ======================================================
// REGISTRAR COMPRA O SERVICIO
// ======================================================

async function registrarMovimiento() {

  const codigoInput =
    document.getElementById("codigoCliente");

  const tipoInput =
    document.getElementById("tipoMovimiento");

  const conceptoInput =
    document.getElementById("concepto");

  const montoInput =
    document.getElementById("monto");

  const observacionInput =
    document.getElementById("observacion");

  const resultadoCliente =
    document.getElementById("resultadoCliente");

  const mensajeRegistro =
    document.getElementById("mensajeRegistro");

  const boton =
    document.getElementById("registrarMovimiento");


  // ------------------------------------------
  // OBTENER VALORES
  // ------------------------------------------

  const codigo =
    codigoInput ?
    codigoInput.value.trim() :
    "";

  const tipo =
    tipoInput ?
    tipoInput.value.trim() :
    "";

  const concepto =
    conceptoInput ?
    conceptoInput.value.trim() :
    "";

  const monto =
    montoInput ?
    Number(montoInput.value) :
    0;

  const observacion =
    observacionInput ?
    observacionInput.value.trim() :
    "";


  // ------------------------------------------
  // VALIDACIONES
  // ------------------------------------------

  if (!codigo) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Ingresa el código del cliente.",
      "error"
    );

    return;

  }


  if (!tipo) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Selecciona el tipo de movimiento.",
      "error"
    );

    return;

  }


  if (!concepto) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Selecciona el concepto.",
      "error"
    );

    return;

  }


  if (!monto || monto <= 0) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Ingresa un monto válido.",
      "error"
    );

    return;

  }


  // ------------------------------------------
  // CONFIRMAR CLIENTE
  // ------------------------------------------

  if (
    codigoInput &&
    codigoInput.dataset.clienteEncontrado !== codigo
  ) {

    mostrarMensaje(
      mensajeRegistro,
      "⚠️ Primero busca y verifica al cliente.",
      "error"
    );

    return;

  }


  // ------------------------------------------
  // DESACTIVAR BOTÓN
  // ------------------------------------------

  if (boton) {

    boton.disabled = true;

    boton.dataset.textoOriginal =
      boton.innerHTML;

    boton.innerHTML =
      "⏳ Registrando...";

  }


  mostrarMensaje(
    mensajeRegistro,
    "⏳ Registrando compra o servicio...",
    "info"
  );


  try {

    // ------------------------------------------
    // CONSTRUIR URL
    // ------------------------------------------

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
      WEB_APP_URL +
      "?" +
      parametros.toString();


    // ------------------------------------------
    // ENVIAR A GOOGLE APPS SCRIPT
    // ------------------------------------------

    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta registrarMovimiento:",
      datos
    );


    // ------------------------------------------
    // ERROR
    // ------------------------------------------

    if (!datos.correcto) {

      mostrarMensaje(
        mensajeRegistro,
        "❌ " +
        (datos.mensaje ||
          "No se pudo registrar."),
        "error"
      );

      return;

    }


    // ------------------------------------------
    // REGISTRO CORRECTO
    // ------------------------------------------

    mostrarMensaje(
      mensajeRegistro,

      `
      <div class="registro-exitoso">

        <strong>
          ✅ ¡Registro realizado correctamente!
        </strong>

        <span>
          Cliente: ${escaparHTML(datos.cliente)}
        </span>

        <span>
          Código: ${escaparHTML(datos.codigoCliente)}
        </span>

        <span>
          Monto: S/ ${Number(datos.monto).toFixed(2)}
        </span>

        <span>
          ⭐ Puntos ganados:
          ${Number(datos.puntosGanados)}
        </span>

        <span>
          ⭐ Puntos totales:
          ${Number(datos.puntosTotales)}
        </span>

      </div>
      `,

      "success"
    );


    // ------------------------------------------
    // ACTUALIZAR INFORMACIÓN DEL CLIENTE
    // ------------------------------------------

    if (resultadoCliente) {

      resultadoCliente.innerHTML = `

        <div class="cliente-encontrado">

          <div class="cliente-icono">
            🎉
          </div>

          <div class="cliente-datos">

            <strong>
              ${escaparHTML(datos.cliente)}
            </strong>

            <span>
              Código:
              ${escaparHTML(datos.codigoCliente)}
            </span>

            <span>
              ⭐ ${Number(datos.puntosTotales)}
              puntos
            </span>

          </div>

        </div>

      `;

    }


    // ------------------------------------------
    // LIMPIAR CAMPOS DE COMPRA
    // ------------------------------------------

    if (montoInput) {

      montoInput.value = "";

    }

    if (observacionInput) {

      observacionInput.value = "";

    }


    // ------------------------------------------
    // LIMPIAR CONCEPTO
    // ------------------------------------------

    if (conceptoInput) {

      conceptoInput.value = "";

    }


  } catch (error) {

    console.error(
      "Error registrando movimiento:",
      error
    );


    mostrarMensaje(
      mensajeRegistro,
      "❌ No se pudo conectar con Google Apps Script.",
      "error"
    );


  } finally {

    // ------------------------------------------
    // VOLVER A ACTIVAR BOTÓN
    // ------------------------------------------

    if (boton) {

      boton.disabled = false;

      boton.innerHTML =
        boton.dataset.textoOriginal ||
        "🧾 Registrar compra / servicio";

    }

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

    console.log(mensaje);

    return;

  }


  elemento.className =
    "mensaje-admin " +
    (tipo || "");


  elemento.innerHTML =
    mensaje;

}


// ======================================================
// SEGURIDAD: ESCAPAR HTML
// ======================================================

function escaparHTML(valor) {

  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
