// =====================================================
// JUANITA PACASMAYO
// SCRIPT.JS
// CONSULTA DE PUNTOS + CÓDIGO + PIN + HISTORIAL
// =====================================================


// =====================================================
// URL DE GOOGLE APPS SCRIPT
// =====================================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// =====================================================
// CUANDO CARGA LA PÁGINA
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("=================================");
  console.log("Juanita Pacasmayo - script.js");
  console.log("Script cargado correctamente");
  console.log("=================================");


  // ===================================================
  // ELEMENTOS
  // ===================================================

  const btnConsultarPuntos =
    document.getElementById("btnConsultarPuntos");

  const codigoCliente =
    document.getElementById("codigoCliente");

  const pinCliente =
    document.getElementById("pinCliente");

  const mensajePuntos =
    document.getElementById("mensajePuntos");

  const resultadoPuntos =
    document.getElementById("resultadoPuntos");

  const nombreCliente =
    document.getElementById("nombreCliente");

  const cantidadPuntos =
    document.getElementById("cantidadPuntos");


  // ===================================================
  // COMPROBAR BOTÓN
  // ===================================================

  if (!btnConsultarPuntos) {

    console.error(
      "No se encontró el botón #btnConsultarPuntos"
    );

    return;
  }


  // ===================================================
  // BOTÓN CONSULTAR
  // ===================================================

  btnConsultarPuntos.addEventListener(
    "click",
    consultarPuntos
  );


  // ===================================================
  // ENTER EN CÓDIGO
  // ===================================================

  if (codigoCliente) {

    codigoCliente.addEventListener(
      "keypress",
      function (event) {

        if (event.key === "Enter") {

          event.preventDefault();

          consultarPuntos();

        }

      }
    );

  }


  // ===================================================
  // ENTER EN PIN
  // ===================================================

  if (pinCliente) {

    pinCliente.addEventListener(
      "keypress",
      function (event) {

        if (event.key === "Enter") {

          event.preventDefault();

          consultarPuntos();

        }

      }
    );

  }


  // ===================================================
  // CONSULTAR CLIENTE
  // ===================================================

  async function consultarPuntos() {

    const codigo =
      codigoCliente
        ? codigoCliente.value.trim().toUpperCase()
        : "";


    const pin =
      pinCliente
        ? pinCliente.value.trim()
        : "";


    // =================================================
    // LIMPIAR MENSAJE
    // =================================================

    ocultarMensaje();


    // =================================================
    // OCULTAR RESULTADO ANTERIOR
    // =================================================

    if (resultadoPuntos) {

      resultadoPuntos.style.display = "none";

    }


    // =================================================
    // VALIDAR CÓDIGO
    // =================================================

    if (!codigo) {

      mostrarMensaje(
        "Por favor, ingresa tu código de cliente.",
        "error"
      );

      return;
    }


    // =================================================
    // VALIDAR PIN
    // =================================================

    if (!pin) {

      mostrarMensaje(
        "Por favor, ingresa tu PIN / contraseña.",
        "error"
      );

      return;
    }


    // =================================================
    // BOTÓN CARGANDO
    // =================================================

    const textoOriginal =
      btnConsultarPuntos.textContent;

    btnConsultarPuntos.disabled = true;

    btnConsultarPuntos.textContent =
      "🔄 Consultando...";


    try {

      // =================================================
      // URL DE CONSULTA
      // =================================================

      const url =
        URL_APPS_SCRIPT +
        "?accion=consultarPuntos" +
        "&codigo=" +
        encodeURIComponent(codigo) +
        "&pin=" +
        encodeURIComponent(pin);


      console.log(
        "Consultando cliente:",
        codigo
      );


      // =================================================
      // FETCH
      // =================================================

      const respuesta =
        await fetch(url);


      if (!respuesta.ok) {

        throw new Error(
          "Error de conexión: " +
          respuesta.status
        );

      }


      // =================================================
      // JSON
      // =================================================

      const datos =
        await respuesta.json();


      console.log(
        "Respuesta consultarPuntos:",
        datos
      );


      // =================================================
      // VALIDAR RESPUESTA
      // =================================================

      if (!datos.correcto) {

        throw new Error(
          datos.mensaje ||
          "Código o PIN incorrecto."
        );

      }


      // =================================================
      // DATOS DEL CLIENTE
      // =================================================

      const nombre =
        datos.cliente ||
        datos.nombre ||
        datos.Nombre ||
        "Cliente";


      const codigoResultado =
        datos.codigoCliente ||
        datos.codigo ||
        datos.CodigoCliente ||
        datos.Codigo ||
        codigo;


      const puntos =
        Number(
          datos.puntos ||
          datos.Puntos ||
          0
        );


      console.log(
        "Cliente:",
        nombre
      );

      console.log(
        "Código:",
        codigoResultado
      );

      console.log(
        "Puntos:",
        puntos
      );


      // =================================================
      // MOSTRAR NOMBRE
      // =================================================

      if (nombreCliente) {

        nombreCliente.textContent =
          nombre;

      }


      // =================================================
      // MOSTRAR PUNTOS
      // =================================================

      if (cantidadPuntos) {

        cantidadPuntos.textContent =
          puntos;

      }


      // =================================================
      // MOSTRAR RESULTADO
      // =================================================

      if (resultadoPuntos) {

        resultadoPuntos.style.display =
          "block";

      }


      // =================================================
      // ACTUALIZAR PREMIOS
      // =================================================

      actualizarPremios(
        puntos
      );


      // =================================================
      // CREAR / MOSTRAR HISTORIAL
      // =================================================

      await cargarHistorial(
        codigoResultado
      );


      // =================================================
      // MENSAJE
      // =================================================

      mostrarMensaje(
        "¡Bienvenido! Consulta realizada correctamente.",
        "exito"
      );


      // =================================================
      // LIMPIAR PIN
      // =================================================

      if (pinCliente) {

        pinCliente.value = "";

      }


    } catch (error) {

      console.error(
        "Error al consultar:",
        error
      );


      if (resultadoPuntos) {

        resultadoPuntos.style.display =
          "none";

      }


      mostrarMensaje(
        error.message ||
        "No se pudo realizar la consulta.",
        "error"
      );


    } finally {

      btnConsultarPuntos.disabled =
        false;

      btnConsultarPuntos.textContent =
        textoOriginal ||
        "🔐 Consultar mis puntos";

    }

  }


  // ===================================================
  // CARGAR HISTORIAL DE PUNTOS
  // ===================================================

  async function cargarHistorial(codigo) {

    console.log(
      "Cargando historial del cliente:",
      codigo
    );


    try {

      // ===============================================
      // URL HISTORIAL
      // ===============================================

      const url =
        URL_APPS_SCRIPT +
        "?accion=obtenerHistorialCliente" +
        "&codigo=" +
        encodeURIComponent(codigo);


      console.log(
        "URL historial:",
        url
      );


      // ===============================================
      // CONSULTAR GOOGLE APPS SCRIPT
      // ===============================================

      const respuesta =
        await fetch(url);


      if (!respuesta.ok) {

        throw new Error(
          "Error HTTP historial: " +
          respuesta.status
        );

      }


      // ===============================================
      // OBTENER JSON
      // ===============================================

      const datos =
        await respuesta.json();


      console.log(
        "Respuesta historial:",
        datos
      );


      // ===============================================
      // SI EL SERVIDOR DEVUELVE ERROR
      // ===============================================

      if (
        datos.correcto === false
      ) {

        throw new Error(
          datos.mensaje ||
          "No se pudo obtener el historial."
        );

      }


      // ===============================================
      // BUSCAR ARRAY DE MOVIMIENTOS
      // ===============================================

      let historial =
        datos.historial ||
        datos.movimientos ||
        datos.movimientosCliente ||
        datos.data ||
        datos.datos ||
        [];


      // ===============================================
      // ASEGURAR QUE SEA ARRAY
      // ===============================================

      if (!Array.isArray(historial)) {

        historial = [];

      }


      console.log(
        "Movimientos encontrados:",
        historial.length
      );


      // ===============================================
      // MOSTRAR HISTORIAL
      // ===============================================

      mostrarHistorial(
        historial
      );


    } catch (error) {

      console.error(
        "Error cargando historial:",
        error
      );


      mostrarHistorialError(
        error.message
      );

    }

  }


  // ===================================================
  // MOSTRAR HISTORIAL
  // ===================================================

  function mostrarHistorial(historial) {

    if (!resultadoPuntos) {
      return;
    }


    // =================================================
    // BUSCAR CONTENEDOR
    // =================================================

    let historialContainer =
      document.getElementById(
        "historialPuntos"
      );


    // =================================================
    // CREAR CONTENEDOR SI NO EXISTE
    // =================================================

    if (!historialContainer) {

      historialContainer =
        document.createElement("div");

      historialContainer.id =
        "historialPuntos";


      historialContainer.style.marginTop =
        "40px";


      historialContainer.style.paddingTop =
        "30px";


      historialContainer.style.borderTop =
        "1px solid #ead1db";


      // Lo colocamos al final del resultado
      resultadoPuntos.appendChild(
        historialContainer
      );

    }


    // =================================================
    // SIN MOVIMIENTOS
    // =================================================

    if (
      !historial ||
      historial.length === 0
    ) {

      historialContainer.innerHTML = `

        <div style="
          text-align:center;
          padding:25px;
          border-radius:18px;
          background:#fff;
          border:1px solid #ead1db;
        ">

          <div style="
            font-size:34px;
            margin-bottom:10px;
          ">
            📋
          </div>

          <h3 style="
            margin:0 0 8px;
            color:#c7386f;
          ">
            Historial de puntos
          </h3>

          <p style="
            margin:0;
            color:#777;
          ">
            Aún no tienes movimientos registrados.
          </p>

        </div>

      `;

      return;

    }


    // =================================================
    // GENERAR FILAS
    // =================================================

    let filas = "";


    historial.forEach(
      function (movimiento) {

        // ---------------------------------------------
        // ACEPTAR DIFERENTES NOMBRES DE COLUMNAS
        // ---------------------------------------------

        const fecha =
          movimiento.fecha ||
          movimiento.Fecha ||
          movimiento.fechaRegistro ||
          movimiento.FechaRegistro ||
          "";


        const tipo =
          movimiento.tipo ||
          movimiento.Tipo ||
          "";


        const concepto =
          movimiento.concepto ||
          movimiento.Concepto ||
          movimiento.descripcion ||
          movimiento.Descripcion ||
          "Movimiento";


        const puntos =
          Number(
            movimiento.puntos ||
            movimiento.Puntos ||
            movimiento.puntosGanados ||
            movimiento.PuntosGanados ||
            0
          );


        const monto =
          movimiento.monto ||
          movimiento.Monto ||
          "";


        const observacion =
          movimiento.observacion ||
          movimiento.Observacion ||
          "";


        // ---------------------------------------------
        // COLOR PUNTOS
        // ---------------------------------------------

        let signo =
          puntos > 0
            ? "+"
            : "";


        // ---------------------------------------------
        // FILA
        // ---------------------------------------------

        filas += `

          <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:15px;
            padding:16px;
            margin-bottom:10px;
            background:#ffffff;
            border:1px solid #ead1db;
            border-radius:15px;
            box-shadow:0 4px 12px rgba(0,0,0,0.04);
          ">

            <!-- INFORMACIÓN -->

            <div style="
              flex:1;
              text-align:left;
            ">

              <div style="
                font-weight:700;
                color:#333;
                font-size:15px;
                margin-bottom:5px;
              ">
                ${escapeHTML(concepto)}
              </div>


              <div style="
                color:#888;
                font-size:13px;
              ">
                ${escapeHTML(String(fecha))}
              </div>


              ${
                tipo
                  ? `
                    <div style="
                      color:#c7386f;
                      font-size:12px;
                      margin-top:4px;
                      font-weight:600;
                    ">
                      ${escapeHTML(String(tipo))}
                    </div>
                  `
                  : ""
              }


              ${
                monto
                  ? `
                    <div style="
                      color:#777;
                      font-size:12px;
                      margin-top:4px;
                    ">
                      Monto: S/ ${escapeHTML(String(monto))}
                    </div>
                  `
                  : ""
              }


              ${
                observacion
                  ? `
                    <div style="
                      color:#777;
                      font-size:12px;
                      margin-top:4px;
                    ">
                      ${escapeHTML(String(observacion))}
                    </div>
                  `
                  : ""
              }

            </div>


            <!-- PUNTOS -->

            <div style="
              min-width:90px;
              text-align:center;
              padding:10px;
              border-radius:12px;
              background:#fff4f8;
            ">

              <div style="
                font-size:20px;
                font-weight:800;
                color:#c7386f;
              ">
                ${signo}${puntos}
              </div>

              <div style="
                font-size:11px;
                color:#888;
              ">
                puntos
              </div>

            </div>

          </div>

        `;

      }
    );


    // =================================================
    // CONTENIDO COMPLETO
    // =================================================

    historialContainer.innerHTML = `

      <div style="
        text-align:center;
        margin-bottom:20px;
      ">

        <div style="
          font-size:32px;
          margin-bottom:5px;
        ">
          📋
        </div>


        <h3 style="
          margin:0;
          color:#c7386f;
          font-size:25px;
        ">
          Historial de puntos
        </h3>


        <p style="
          margin:8px 0 0;
          color:#777;
          font-size:14px;
        ">
          Aquí puedes revisar tus movimientos y puntos ganados.
        </p>

      </div>


      <div>
        ${filas}
      </div>

    `;

  }


  // ===================================================
  // ERROR DEL HISTORIAL
  // ===================================================

  function mostrarHistorialError(
    mensaje
  ) {

    if (!resultadoPuntos) {
      return;
    }


    let historialContainer =
      document.getElementById(
        "historialPuntos"
      );


    if (!historialContainer) {

      historialContainer =
        document.createElement("div");

      historialContainer.id =
        "historialPuntos";


      historialContainer.style.marginTop =
        "40px";


      historialContainer.style.paddingTop =
        "30px";


      historialContainer.style.borderTop =
        "1px solid #ead1db";


      resultadoPuntos.appendChild(
        historialContainer
      );

    }


    historialContainer.innerHTML = `

      <div style="
        text-align:center;
        padding:25px;
        border-radius:18px;
        background:#fff;
        border:1px solid #ead1db;
      ">

        <div style="
          font-size:32px;
          margin-bottom:8px;
        ">
          📋
        </div>


        <h3 style="
          margin:0 0 8px;
          color:#c7386f;
        ">
          Historial de puntos
        </h3>


        <p style="
          margin:0;
          color:#777;
          font-size:14px;
        ">
          No se pudo cargar el historial.
        </p>

      </div>

    `;


    console.error(
      "Historial:",
      mensaje
    );

  }


  // ===================================================
  // ACTUALIZAR PREMIOS
  // ===================================================

  function actualizarPremios(
    puntosCliente
  ) {

    const lista =
      document.querySelector(
        ".premios-lista"
      );


    if (!lista) {

      console.warn(
        "No se encontró .premios-lista"
      );

      return;

    }


    const premios =
      lista.querySelectorAll(
        ".premio"
      );


    premios.forEach(
      function (premio) {

        const strong =
          premio.querySelector(
            "strong"
          );


        if (!strong) {
          return;
        }


        // =============================================
        // PUNTOS DEL PREMIO
        // =============================================

        const textoPuntos =
          strong.textContent;


        const puntosPremio =
          parseInt(
            textoPuntos.replace(
              /\D/g,
              ""
            ),
            10
          );


        if (!puntosPremio) {
          return;
        }


        // =============================================
        // ELIMINAR ESTADO ANTERIOR
        // =============================================

        const mensajeAnterior =
          premio.querySelector(
            ".estado-premio"
          );


        if (mensajeAnterior) {

          mensajeAnterior.remove();

        }


        // =============================================
        // PREMIO DISPONIBLE
        // =============================================

        if (
          puntosCliente >=
          puntosPremio
        ) {

          premio.classList.add(
            "premio-disponible"
          );


          const mensaje =
            document.createElement(
              "div"
            );


          mensaje.className =
            "estado-premio";


          mensaje.textContent =
            "🎉 ¡Premio disponible!";


          premio.appendChild(
            mensaje
          );

        }


        // =============================================
        // PREMIO BLOQUEADO
        // =============================================

        else {

          premio.classList.remove(
            "premio-disponible"
          );


          const faltan =
            puntosPremio -
            puntosCliente;


          const mensaje =
            document.createElement(
              "div"
            );


          mensaje.className =
            "estado-premio";


          mensaje.textContent =
            "Te faltan " +
            faltan +
            " puntos";


          premio.appendChild(
            mensaje
          );

        }

      }
    );

  }


  // ===================================================
  // ESCAPAR HTML
  // ===================================================

  function escapeHTML(text) {

    return String(text)
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


  // ===================================================
  // MOSTRAR MENSAJE
  // ===================================================

  function mostrarMensaje(
    texto,
    tipo
  ) {

    if (!mensajePuntos) {
      return;
    }


    mensajePuntos.textContent =
      texto;


    mensajePuntos.style.display =
      "block";


    if (tipo === "error") {

      mensajePuntos.style.color =
        "#c62828";

      mensajePuntos.style.background =
        "#ffebee";

      mensajePuntos.style.border =
        "1px solid #ef9a9a";

    }

    else {

      mensajePuntos.style.color =
        "#2e7d32";

      mensajePuntos.style.background =
        "#e8f5e9";

      mensajePuntos.style.border =
        "1px solid #a5d6a7";

    }


    mensajePuntos.style.padding =
      "14px 20px";

    mensajePuntos.style.borderRadius =
      "12px";

    mensajePuntos.style.marginTop =
      "15px";

  }


  // ===================================================
  // OCULTAR MENSAJE
  // ===================================================

  function ocultarMensaje() {

    if (!mensajePuntos) {
      return;
    }


    mensajePuntos.textContent =
      "";


    mensajePuntos.style.display =
      "none";

  }

});


// =====================================================
// MENÚ MÓVIL
// =====================================================

const menuToggle =
  document.querySelector(
    ".menu-toggle"
  );


const mainNav =
  document.querySelector(
    ".main-nav"
  );


if (
  menuToggle &&
  mainNav
) {

  menuToggle.addEventListener(
    "click",
    function () {

      const abierto =
        mainNav.classList.toggle(
          "menu-abierto"
        );


      menuToggle.setAttribute(
        "aria-expanded",
        abierto
          ? "true"
          : "false"
      );

    }
  );


  // ===================================================
  // CERRAR MENÚ
  // ===================================================

  mainNav
    .querySelectorAll("a")
    .forEach(
      function (enlace) {

        enlace.addEventListener(
          "click",
          function () {

            mainNav.classList.remove(
              "menu-abierto"
            );


            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      }
    );

}
