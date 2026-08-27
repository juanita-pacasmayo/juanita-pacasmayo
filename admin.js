// ======================================================
// JUANITA PACASMAYO
// ADMINISTRACIÓN - SISTEMA DE PUNTOS
// ======================================================


// ======================================================
// URL DE GOOGLE APPS SCRIPT
// ======================================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// ======================================================
// ESPERAR A QUE CARGUE LA PÁGINA
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("=================================");
  console.log("✅ ADMIN.JS CARGADO");
  console.log("=================================");


  // --------------------------------------------------
  // BOTÓN BUSCAR CLIENTE
  // --------------------------------------------------

  const btnBuscarCliente =
    document.getElementById("btnBuscarCliente");


  if (btnBuscarCliente) {

    btnBuscarCliente.addEventListener(
      "click",
      buscarCliente
    );

  } else {

    console.error(
      "❌ No se encontró btnBuscarCliente"
    );

  }


  // --------------------------------------------------
  // BOTÓN REGISTRAR MOVIMIENTO
  // --------------------------------------------------

  const btnRegistrarMovimiento =
    document.getElementById(
      "btnRegistrarMovimiento"
    );


  if (btnRegistrarMovimiento) {

    btnRegistrarMovimiento.addEventListener(
      "click",
      registrarMovimiento
    );

  } else {

    console.error(
      "❌ No se encontró btnRegistrarMovimiento"
    );

  }


  // --------------------------------------------------
  // ENTER EN EL CÓDIGO
  // --------------------------------------------------

  const codigoRegistro =
    document.getElementById(
      "codigoRegistro"
    );


  if (codigoRegistro) {

    codigoRegistro.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Enter") {

          event.preventDefault();

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
    document.getElementById(
      "codigoRegistro"
    );


  const clienteRegistro =
    document.getElementById(
      "clienteRegistro"
    );


  const nombreRegistro =
    document.getElementById(
      "nombreRegistro"
    );


  const puntosRegistro =
    document.getElementById(
      "puntosRegistro"
    );


  const mensajeRegistro =
    document.getElementById(
      "mensajeRegistro"
    );


  // --------------------------------------------------
  // OBTENER CÓDIGO
  // --------------------------------------------------

  const codigo =
    codigoInput.value.trim();


  console.log(
    "Código ingresado:",
    codigo
  );


  // --------------------------------------------------
  // VALIDAR
  // --------------------------------------------------

  if (!codigo) {

    mostrarMensaje(
      "⚠️ Escribe el código del cliente.",
      "error"
    );

    clienteRegistro.style.display =
      "none";

    return;

  }


  // --------------------------------------------------
  // MOSTRAR BUSCANDO
  // --------------------------------------------------

  mostrarMensaje(
    "🔎 Buscando cliente...",
    "info"
  );


  clienteRegistro.style.display =
    "none";


  try {

    // ------------------------------------------------
    // CREAR URL
    // ------------------------------------------------

    const url =
      URL_APPS_SCRIPT +
      "?accion=consultarPuntos" +
      "&codigo=" +
      encodeURIComponent(codigo);


    console.log(
      "URL consulta:",
      url
    );


    // ------------------------------------------------
    // CONSULTAR APPS SCRIPT
    // ------------------------------------------------

    const respuesta =
      await fetch(url);


    console.log(
      "Estado HTTP:",
      respuesta.status
    );


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta Apps Script:",
      datos
    );


    // ------------------------------------------------
    // COMPROBAR RESPUESTA
    // ------------------------------------------------

    if (!datos.correcto) {

      mostrarMensaje(
        "❌ " +
        (
          datos.mensaje ||
          "No se encontró el cliente."
        ),
        "error"
      );

      return;

    }


    // ------------------------------------------------
    // MOSTRAR CLIENTE
    // ------------------------------------------------

    nombreRegistro.textContent =
      datos.cliente;


    puntosRegistro.textContent =
      "⭐ " +
      Number(datos.puntos || 0) +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    // ------------------------------------------------
    // GUARDAR CÓDIGO CONFIRMADO
    // ------------------------------------------------

    codigoInput.dataset.clienteEncontrado =
      datos.codigoCliente;


    // ------------------------------------------------
    // MENSAJE
    // ------------------------------------------------

    mostrarMensaje(
      "✅ Cliente encontrado correctamente.",
      "success"
    );


  } catch (error) {

    console.error(
      "❌ Error:",
      error
    );


    mostrarMensaje(
      "❌ No se pudo conectar con Google Apps Script.",
      "error"
    );

  }

}


// ======================================================
// REGISTRAR COMPRA O SERVICIO
// ======================================================

async function registrarMovimiento() {

  const codigoInput =
    document.getElementById(
      "codigoRegistro"
    );


  const tipoInput =
    document.getElementById(
      "tipoRegistro"
    );


  const conceptoInput =
    document.getElementById(
      "conceptoRegistro"
    );


  const montoInput =
    document.getElementById(
      "montoRegistro"
    );


  const observacionInput =
    document.getElementById(
      "observacionRegistro"
    );


  const mensajeRegistro =
    document.getElementById(
      "mensajeRegistro"
    );


  const resultadoRegistro =
    document.getElementById(
      "resultadoRegistro"
    );


  const detalleRegistro =
    document.getElementById(
      "detalleRegistro"
    );


  const clienteRegistro =
    document.getElementById(
      "clienteRegistro"
    );


  const puntosRegistro =
    document.getElementById(
      "puntosRegistro"
    );


  const btnRegistrar =
    document.getElementById(
      "btnRegistrarMovimiento"
    );


  // --------------------------------------------------
  // OBTENER DATOS
  // --------------------------------------------------

  const codigo =
    codigoInput.value.trim();


  const tipo =
    tipoInput.value;


  const concepto =
    conceptoInput.value;


  const monto =
    Number(montoInput.value);


  const observacion =
    observacionInput.value.trim();


  // --------------------------------------------------
  // VALIDAR CLIENTE
  // --------------------------------------------------

  if (!codigo) {

    mostrarMensaje(
      "⚠️ Ingresa el código del cliente.",
      "error"
    );

    return;

  }


  // --------------------------------------------------
  // COMPROBAR QUE SE HAYA BUSCADO
  // --------------------------------------------------

  if (
    codigoInput.dataset.clienteEncontrado !==
    codigo
  ) {

    mostrarMensaje(
      "⚠️ Primero pulsa Buscar y verifica el cliente.",
      "error"
    );

    return;

  }


  // --------------------------------------------------
  // VALIDAR MONTO
  // --------------------------------------------------

  if (
    !monto ||
    monto <= 0
  ) {

    mostrarMensaje(
      "⚠️ Ingresa un monto válido.",
      "error"
    );

    montoInput.focus();

    return;

  }


  // --------------------------------------------------
  // DESACTIVAR BOTÓN
  // --------------------------------------------------

  btnRegistrar.disabled =
    true;


  const textoOriginal =
    btnRegistrar.innerHTML;


  btnRegistrar.innerHTML =
    "⏳ Registrando...";


  mostrarMensaje(
    "⏳ Registrando compra o servicio...",
    "info"
  );


  try {

    // ------------------------------------------------
    // CREAR PARÁMETROS
    // ------------------------------------------------

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


    // ------------------------------------------------
    // CREAR URL
    // ------------------------------------------------

    const url =
      URL_APPS_SCRIPT +
      "?" +
      parametros.toString();


    console.log(
      "URL registro:",
      url
    );


    // ------------------------------------------------
    // ENVIAR
    // ------------------------------------------------

    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta registro:",
      datos
    );


    // ------------------------------------------------
    // ERROR
    // ------------------------------------------------

    if (!datos.correcto) {

      mostrarMensaje(
        "❌ " +
        (
          datos.mensaje ||
          "No se pudo registrar."
        ),
        "error"
      );

      return;

    }


    // ------------------------------------------------
    // REGISTRO CORRECTO
    // ------------------------------------------------

    mostrarMensaje(
      "✅ Movimiento registrado correctamente.",
      "success"
    );


    // ------------------------------------------------
    // MOSTRAR RESULTADO
    // ------------------------------------------------

    detalleRegistro.innerHTML = `

      <strong>
        ${escaparHTML(datos.cliente)}
      </strong>

      <br><br>

      Código:
      ${escaparHTML(datos.codigoCliente)}

      <br>

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


    // ------------------------------------------------
    // ACTUALIZAR PUNTOS EN PANTALLA
    // ------------------------------------------------

    puntosRegistro.textContent =
      "⭐ " +
      Number(datos.puntosTotales) +
      " puntos";


    clienteRegistro.style.display =
      "flex";


    // ------------------------------------------------
    // LIMPIAR MONTO
    // ------------------------------------------------

    montoInput.value =
      "";


    observacionInput.value =
      "";


  } catch (error) {

    console.error(
      "❌ Error registrando:",
      error
    );


    mostrarMensaje(
      "❌ Error de conexión con Google Apps Script.",
      "error"
    );


  } finally {

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
  mensaje,
  tipo
) {

  const elemento =
    document.getElementById(
      "mensajeRegistro"
    );


  if (!elemento) {

    console.error(
      mensaje
    );

    return;

  }


  elemento.textContent =
    mensaje;


  elemento.className =
    "mensaje-registro";


  if (tipo) {

    elemento.classList.add(
      "mensaje-" + tipo
    );

  }

}


// ======================================================
// SEGURIDAD
// ======================================================

function escaparHTML(valor) {

  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

// ======================================================
// CARGAR HISTORIAL DEL CLIENTE
// ======================================================

async function cargarHistorial(codigo) {

  const historialCliente =
    document.getElementById(
      "historialCliente"
    );

  const listaHistorial =
    document.getElementById(
      "listaHistorial"
    );

  const totalMovimientos =
    document.getElementById(
      "totalMovimientos"
    );


  if (!historialCliente) {
    return;
  }


  historialCliente.style.display =
    "block";


  listaHistorial.innerHTML = `
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


    console.log(
      "Historial:",
      url
    );


    const respuesta =
      await fetch(url);


    const datos =
      await respuesta.json();


    console.log(
      "Respuesta historial:",
      datos
    );


    if (!datos.correcto) {

      listaHistorial.innerHTML = `
        <div class="historial-vacio">
          ❌ ${escaparHTML(
            datos.mensaje ||
            "No se pudo obtener el historial."
          )}
        </div>
      `;

      return;

    }


    const historial =
      datos.historial || [];


    totalMovimientos.textContent =
      historial.length +
      (
        historial.length === 1
          ? " movimiento"
          : " movimientos"
      );


    // --------------------------------------------------
    // SIN MOVIMIENTOS
    // --------------------------------------------------

    if (historial.length === 0) {

      listaHistorial.innerHTML = `

        <div class="historial-vacio">

          <div>
            📋
          </div>

          <strong>
            Aún no hay movimientos
          </strong>

          <p>
            Este cliente todavía no tiene
            compras o servicios registrados.
          </p>

        </div>

      `;

      return;

    }


    // --------------------------------------------------
    // CREAR TARJETAS
    // --------------------------------------------------

    listaHistorial.innerHTML =
      historial.map(
        function (movimiento) {

          const monto =
            Number(
              movimiento.monto || 0
            ).toFixed(2);


          const puntos =
            Number(
              movimiento.puntos || 0
            );


          let icono = "🧾";


          const concepto =
            String(
              movimiento.concepto || ""
            ).toLowerCase();


          if (
            concepto.includes("laceado")
          ) {

            icono = "💇";

          } else if (
            concepto.includes("uña")
          ) {

            icono = "💅";

          } else if (
            concepto.includes("pestaña")
          ) {

            icono = "👁️";

          } else if (
            concepto.includes("producto")
          ) {

            icono = "🛍️";

          }


          return `

            <div class="movimiento-card">

              <div class="movimiento-icono">
                ${icono}
              </div>


              <div class="movimiento-info">

                <strong>
                  ${escaparHTML(
                    movimiento.concepto
                  )}
                </strong>

                <span>
                  ${escaparHTML(
                    movimiento.tipo
                  )}
                </span>

                <small>
                  📅 ${escaparHTML(
                    movimiento.fecha
                  )}
                </small>

              </div>


              <div class="movimiento-datos">

                <strong>
                  S/ ${monto}
                </strong>

                <span>
                  ⭐ +${puntos} puntos
                </span>

              </div>

            </div>

          `;

        }
      ).join("");


  } catch (error) {

    console.error(
      "Error historial:",
      error
    );


    listaHistorial.innerHTML = `

      <div class="historial-vacio">

        ❌ No se pudo cargar
        el historial del cliente.

      </div>

    `;

  }

}
