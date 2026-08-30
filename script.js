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

  console.log("script.js cargado correctamente");


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
      "No se encontró btnConsultarPuntos"
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


    // -------------------------------------------------
    // LIMPIAR MENSAJE
    // -------------------------------------------------

    ocultarMensaje();


    // -------------------------------------------------
    // OCULTAR RESULTADO ANTERIOR
    // -------------------------------------------------

    if (resultadoPuntos) {

      resultadoPuntos.style.display =
        "none";

    }


    // -------------------------------------------------
    // VALIDAR CÓDIGO
    // -------------------------------------------------

    if (!codigo) {

      mostrarMensaje(
        "Por favor, ingresa tu código de cliente.",
        "error"
      );

      if (codigoCliente) {
        codigoCliente.focus();
      }

      return;
    }


    // -------------------------------------------------
    // VALIDAR PIN
    // -------------------------------------------------

    if (!pin) {

      mostrarMensaje(
        "Por favor, ingresa tu PIN / contraseña.",
        "error"
      );

      if (pinCliente) {
        pinCliente.focus();
      }

      return;
    }


    // -------------------------------------------------
    // BOTÓN CARGANDO
    // -------------------------------------------------

    const textoOriginal =
      btnConsultarPuntos.textContent;

    btnConsultarPuntos.disabled =
      true;

    btnConsultarPuntos.textContent =
      "🔐 Verificando...";


    try {

      // =================================================
      // CONSULTAR CÓDIGO + PIN
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
          "Error HTTP: " +
          respuesta.status
        );

      }


      // =================================================
      // RESPUESTA JSON
      // =================================================

      const datos =
        await respuesta.json();


      console.log(
        "Respuesta de Google Apps Script:",
        datos
      );


      // =================================================
      // COMPROBAR RESPUESTA
      // =================================================

      if (!datos.correcto) {

        throw new Error(
          datos.mensaje ||
          "Código o PIN incorrectos."
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
        Number(datos.puntos) || 0;


      console.log(
        "Nombre:",
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
      // NOMBRE
      // =================================================

      if (nombreCliente) {

        nombreCliente.textContent =
          nombre;

      }


      // =================================================
      // PUNTOS
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
      // OBTENER HISTORIAL
      // =================================================

      await cargarHistorial(
        codigoResultado,
        pin
      );


      // =================================================
      // MENSAJE DE ÉXITO
      // =================================================

      mostrarMensaje(
        "¡Bienvenido! Consulta realizada correctamente.",
        "exito"
      );


      // =================================================
      // LIMPIAR PIN POR SEGURIDAD
      // =================================================

      if (pinCliente) {

        pinCliente.value = "";

      }


    } catch (error) {

      console.error(
        "Error:",
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

  async function cargarHistorial(
    codigo,
    pin
  ) {

    try {

      // -------------------------------------------------
      // CREAR / OBTENER CONTENEDOR
      // -------------------------------------------------

      const contenedor =
        obtenerContenedorHistorial();


      if (!contenedor) {

        console.warn(
          "No se pudo crear el historial."
        );

        return;

      }


      // -------------------------------------------------
      // MENSAJE DE CARGA
      // -------------------------------------------------

      contenedor.innerHTML = `

        <div style="
          text-align:center;
          padding:25px;
          color:#777;
        ">

          <div style="
            font-size:30px;
            margin-bottom:10px;
          ">
            ⏳
          </div>

          <div>
            Cargando historial de puntos...
          </div>

        </div>

      `;


      // -------------------------------------------------
      // URL
      // -------------------------------------------------

      const url =
        URL_APPS_SCRIPT +
        "?accion=obtenerHistorialCliente" +
        "&codigo=" +
        encodeURIComponent(codigo) +
        "&pin=" +
        encodeURIComponent(pin);


      console.log(
        "Consultando historial..."
      );


      // -------------------------------------------------
      // FETCH
      // -------------------------------------------------

      const respuesta =
        await fetch(url);


      if (!respuesta.ok) {

        throw new Error(
          "Error al consultar historial."
        );

      }


      // -------------------------------------------------
      // JSON
      // -------------------------------------------------

      const datos =
        await respuesta.json();


      console.log(
        "Historial recibido:",
        datos
      );


      // -------------------------------------------------
      // COMPROBAR RESPUESTA
      // -------------------------------------------------

      if (!datos.correcto) {

        contenedor.innerHTML = `

          <div style="
            text-align:center;
            padding:25px;
            color:#777;
          ">

            <div style="
              font-size:30px;
              margin-bottom:10px;
            ">
              📋
            </div>

            <p>
              No se pudo cargar el historial.
            </p>

          </div>

        `;

        return;

      }


      // -------------------------------------------------
      // OBTENER LISTA
      // -------------------------------------------------

      const historial =
        datos.historial ||
        datos.movimientos ||
        datos.data ||
        datos.registros ||
        [];


      // -------------------------------------------------
      // SI NO HAY HISTORIAL
      // -------------------------------------------------

      if (
        !Array.isArray(historial) ||
        historial.length === 0
      ) {

        contenedor.innerHTML = `

          <div style="
            text-align:center;
            padding:25px;
            color:#777;
          ">

            <div style="
              font-size:32px;
              margin-bottom:10px;
            ">
              📋
            </div>

            <h4 style="
              margin:0 0 8px 0;
              color:#c7386f;
            ">
              Historial de puntos
            </h4>

            <p style="
              margin:0;
            ">
              Aún no tienes movimientos registrados.
            </p>

          </div>

        `;

        return;

      }


      // -------------------------------------------------
      // MOSTRAR HISTORIAL
      // -------------------------------------------------

      mostrarHistorial(
        contenedor,
        historial
      );


    } catch (error) {

      console.error(
        "Error cargando historial:",
        error
      );


      const contenedor =
        obtenerContenedorHistorial();


      if (contenedor) {

        contenedor.innerHTML = `

          <div style="
            text-align:center;
            padding:25px;
            color:#777;
          ">

            <div style="
              font-size:30px;
              margin-bottom:10px;
            ">
              📋
            </div>

            <h4 style="
              margin:0 0 8px 0;
              color:#c7386f;
            ">
              Historial de puntos
            </h4>

            <p style="
              margin:0;
            ">
              No se pudo cargar el historial en este momento.
            </p>

          </div>

        `;

      }

    }

  }


  // ===================================================
  // CREAR CONTENEDOR HISTORIAL
  // ===================================================

  function obtenerContenedorHistorial() {

    if (!resultadoPuntos) {
      return null;
    }


    let historial =
      document.getElementById(
        "historialPuntos"
      );


    // -------------------------------------------------
    // SI YA EXISTE
    // -------------------------------------------------

    if (historial) {

      return historial;

    }


    // -------------------------------------------------
    // CREAR CONTENEDOR
    // -------------------------------------------------

    historial =
      document.createElement("div");


    historial.id =
      "historialPuntos";


    historial.style.marginTop =
      "35px";


    historial.style.paddingTop =
      "30px";


    historial.style.borderTop =
      "1px solid #ead1db";


    // -------------------------------------------------
    // AGREGAR AL RESULTADO
    // -------------------------------------------------

    resultadoPuntos.appendChild(
      historial
    );


    return historial;

  }


  // ===================================================
  // MOSTRAR HISTORIAL
  // ===================================================

  function mostrarHistorial(
    contenedor,
    historial
  ) {

    let html = `

      <div style="
        text-align:center;
        margin-bottom:25px;
      ">

        <div style="
          font-size:13px;
          letter-spacing:2px;
          color:#c7386f;
          font-weight:700;
          margin-bottom:8px;
        ">
          TUS MOVIMIENTOS
        </div>

        <h3 style="
          margin:0;
          font-size:28px;
          color:#c7386f;
        ">
          📋 Historial de puntos
        </h3>

        <p style="
          margin:8px 0 0 0;
          color:#777;
          font-size:14px;
        ">
          Aquí puedes consultar los puntos que has ganado.
        </p>

      </div>


      <div style="
        display:flex;
        flex-direction:column;
        gap:12px;
      ">
    `;


    // =================================================
    // RECORRER HISTORIAL
    // =================================================

    historial.forEach(function (
      movimiento
    ) {

      // ------------------------------------------------
      // SOPORTAR DIFERENTES NOMBRES DE CAMPOS
      // ------------------------------------------------

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


      const monto =
        movimiento.monto ||
        movimiento.Monto ||
        0;


      const puntos =
        movimiento.puntos ||
        movimiento.Puntos ||
        movimiento.puntosGanados ||
        movimiento.PuntosGanados ||
        0;


      const observacion =
        movimiento.observacion ||
        movimiento.Observacion ||
        "";


      // ------------------------------------------------
      // FORMATEAR FECHA
      // ------------------------------------------------

      const fechaFormateada =
        formatearFecha(fecha);


      // ------------------------------------------------
      // FORMATEAR MONTO
      // ------------------------------------------------

      const montoNumero =
        Number(monto) || 0;


      const montoTexto =
        montoNumero > 0
          ? "S/ " +
            montoNumero.toFixed(2)
          : "";


      // ------------------------------------------------
      // FORMATEAR PUNTOS
      // ------------------------------------------------

      const puntosNumero =
        Number(puntos) || 0;


      // ------------------------------------------------
      // CREAR TARJETA
      // ------------------------------------------------

      html += `

        <div style="
          background:#ffffff;
          border:1px solid #ead1db;
          border-radius:16px;
          padding:18px 20px;
          box-shadow:0 5px 18px rgba(0,0,0,0.05);
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:15px;
          flex-wrap:wrap;
        ">


          <!-- INFORMACIÓN -->

          <div style="
            flex:1;
            min-width:200px;
          ">

            <div style="
              font-size:16px;
              font-weight:700;
              color:#333;
              margin-bottom:5px;
            ">
              ${escapeHTML(concepto)}
            </div>


            <div style="
              font-size:13px;
              color:#777;
              margin-bottom:4px;
            ">
              📅 ${escapeHTML(fechaFormateada)}
            </div>


            ${
              tipo
                ? `
                  <div style="
                    font-size:13px;
                    color:#888;
                  ">
                    ${escapeHTML(tipo)}
                  </div>
                `
                : ""
            }


            ${
              observacion
                ? `
                  <div style="
                    font-size:13px;
                    color:#888;
                    margin-top:4px;
                  ">
                    ${escapeHTML(observacion)}
                  </div>
                `
                : ""
            }

          </div>


          <!-- MONTO -->

          ${
            montoTexto
              ? `
                <div style="
                  min-width:90px;
                  text-align:center;
                ">

                  <div style="
                    font-size:12px;
                    color:#999;
                    margin-bottom:4px;
                  ">
                    Consumo
                  </div>

                  <div style="
                    font-size:16px;
                    font-weight:700;
                    color:#555;
                  ">
                    ${montoTexto}
                  </div>

                </div>
              `
              : ""
          }


          <!-- PUNTOS -->

          <div style="
            min-width:100px;
            text-align:center;
            background:#fff4f8;
            border-radius:12px;
            padding:10px 14px;
          ">

            <div style="
              font-size:12px;
              color:#999;
              margin-bottom:3px;
            ">
              Puntos
            </div>

            <div style="
              font-size:20px;
              font-weight:800;
              color:#c7386f;
            ">
              +${puntosNumero}
            </div>

          </div>


        </div>

      `;

    });


    html += `
      </div>
    `;


    // -------------------------------------------------
    // INSERTAR
    // -------------------------------------------------

    contenedor.innerHTML =
      html;

  }


  // ===================================================
  // FORMATEAR FECHA
  // ===================================================

  function formatearFecha(
    fecha
  ) {

    if (!fecha) {
      return "Fecha no disponible";
    }


    // -------------------------------------------------
    // SI YA ES TEXTO
    // -------------------------------------------------

    if (
      typeof fecha === "string"
    ) {

      // Si viene como fecha completa
      // intentamos convertirla

      const fechaDate =
        new Date(fecha);


      if (
        !isNaN(
          fechaDate.getTime()
        )
      ) {

        return fechaDate.toLocaleDateString(
          "es-PE",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          }
        );

      }


      return fecha;

    }


    // -------------------------------------------------
    // SI ES FECHA NUMÉRICA
    // -------------------------------------------------

    const fechaDate =
      new Date(fecha);


    if (
      !isNaN(
        fechaDate.getTime()
      )
    ) {

      return fechaDate.toLocaleDateString(
        "es-PE",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }
      );

    }


    return String(fecha);

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


    premios.forEach(function (
      premio
    ) {

      const strong =
        premio.querySelector(
          "strong"
        );


      if (!strong) {
        return;
      }


      // -----------------------------------------------
      // OBTENER PUNTOS DEL PREMIO
      // -----------------------------------------------

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


      // -----------------------------------------------
      // ELIMINAR MENSAJE ANTERIOR
      // -----------------------------------------------

      const mensajeAnterior =
        premio.querySelector(
          ".estado-premio"
        );


      if (mensajeAnterior) {

        mensajeAnterior.remove();

      }


      // -----------------------------------------------
      // PREMIO DISPONIBLE
      // -----------------------------------------------

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


      // -----------------------------------------------
      // PREMIO BLOQUEADO
      // -----------------------------------------------

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

    });

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
      "14px";

    mensajePuntos.style.borderRadius =
      "12px";

    mensajePuntos.style.marginTop =
      "15px";

    mensajePuntos.style.textAlign =
      "center";

    mensajePuntos.style.fontWeight =
      "600";

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


  // ===================================================
  // ESCAPAR HTML
  // ===================================================

  function escapeHTML(
    text
  ) {

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


  // ---------------------------------------------------
  // CERRAR MENÚ AL SELECCIONAR
  // ---------------------------------------------------

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
