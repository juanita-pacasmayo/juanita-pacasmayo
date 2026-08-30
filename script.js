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
  console.log("Juanita Pacasmayo");
  console.log("script.js cargado correctamente");
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

    // -------------------------------------------------
    // OBTENER CÓDIGO
    // -------------------------------------------------

    const codigo =
      codigoCliente
        ? codigoCliente.value.trim().toUpperCase()
        : "";


    // -------------------------------------------------
    // OBTENER PIN
    // -------------------------------------------------

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


    // =================================================
    // BOTÓN CARGANDO
    // =================================================

    const textoOriginal =
      btnConsultarPuntos.textContent;


    btnConsultarPuntos.disabled =
      true;


    btnConsultarPuntos.textContent =
      "🔄 Consultando...";


    try {

      // ===============================================
      // CREAR URL
      // ===============================================

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


      // ===============================================
      // FETCH
      // ===============================================

      const respuesta =
        await fetch(url);


      // ===============================================
      // COMPROBAR HTTP
      // ===============================================

      if (!respuesta.ok) {

        throw new Error(
          "Error de conexión con el servidor: " +
          respuesta.status
        );

      }


      // ===============================================
      // CONVERTIR A JSON
      // ===============================================

      const datos =
        await respuesta.json();


      console.log(
        "Respuesta Google Apps Script:",
        datos
      );


      // ===============================================
      // COMPROBAR RESPUESTA
      // ===============================================

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
      // PREMIOS
      // =================================================

      actualizarPremios(
        puntos
      );


      // =================================================
      // HISTORIAL
      // =================================================

      /*
       IMPORTANTE:

       El Código.gs debe devolver algo como:

       historial: [
         {
           Fecha: "30/08/2026",
           Tipo: "Servicio",
           Concepto: "Laceado",
           Monto: 80,
           Puntos: 80
         }
       ]
      */


      let historial =
        datos.historial ||
        datos.Historial ||
        [];


      // -------------------------------------------------
      // SI EL HISTORIAL VIENE DENTRO DE CLIENTE
      // -------------------------------------------------

      if (
        (!Array.isArray(historial) ||
        historial.length === 0) &&
        datos.clienteData &&
        Array.isArray(datos.clienteData.historial)
      ) {

        historial =
          datos.clienteData.historial;

      }


      console.log(
        "Historial recibido:",
        historial
      );


      // -------------------------------------------------
      // MOSTRAR HISTORIAL
      // -------------------------------------------------

      mostrarHistorial(
        historial
      );


      // =================================================
      // MOSTRAR RESULTADO
      // =================================================

      if (resultadoPuntos) {

        resultadoPuntos.style.display =
          "block";

      }


      // =================================================
      // MENSAJE DE ÉXITO
      // =================================================

      mostrarMensaje(
        "¡Bienvenido! Consulta realizada correctamente.",
        "exito"
      );


      // =================================================
      // LIMPIAR PIN
      // =================================================

      /*
       Por seguridad, después de consultar
       dejamos vacío el campo PIN.
      */

      if (pinCliente) {

        pinCliente.value =
          "";

      }


    } catch (error) {

      console.error(
        "Error al consultar:",
        error
      );


      // -------------------------------------------------
      // OCULTAR RESULTADO
      // -------------------------------------------------

      if (resultadoPuntos) {

        resultadoPuntos.style.display =
          "none";

      }


      // -------------------------------------------------
      // MOSTRAR ERROR
      // -------------------------------------------------

      mostrarMensaje(
        error.message ||
        "No se pudo realizar la consulta.",
        "error"
      );


    } finally {

      // -------------------------------------------------
      // RESTAURAR BOTÓN
      // -------------------------------------------------

      btnConsultarPuntos.disabled =
        false;


      btnConsultarPuntos.textContent =
        textoOriginal ||
        "🔐 Consultar mis puntos";

    }

  }


  // =====================================================
  // ACTUALIZAR PREMIOS
  // =====================================================

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

      }
    );

  }


  // =====================================================
  // MOSTRAR HISTORIAL
  // =====================================================

  function mostrarHistorial(
    historial
  ) {

    if (!resultadoPuntos) {
      return;
    }


    // ---------------------------------------------------
    // BUSCAR CONTENEDOR EXISTENTE
    // ---------------------------------------------------

    let contenedor =
      document.getElementById(
        "historialPuntos"
      );


    // ---------------------------------------------------
    // CREAR CONTENEDOR
    // ---------------------------------------------------

    if (!contenedor) {

      contenedor =
        document.createElement(
          "div"
        );


      contenedor.id =
        "historialPuntos";


      resultadoPuntos.appendChild(
        contenedor
      );

    }


    // ===================================================
    // AGREGAR ESTILOS UNA SOLA VEZ
    // ===================================================

    if (
      !document.getElementById(
        "estiloHistorial"
      )
    ) {

      const css =
        document.createElement(
          "style"
        );


      css.id =
        "estiloHistorial";


      css.textContent = `

        /* ==========================================
           CONTENEDOR
        ========================================== */

        #historialPuntos {
          width: 100%;
          margin-top: 38px;
          box-sizing: border-box;
        }


        .historial-contenedor {
          width: 100%;
          box-sizing: border-box;
          background: #ffffff;
          border: 1px solid #ead6df;
          border-radius: 20px;
          padding: 25px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
        }


        /* ==========================================
           CABECERA
        ========================================== */

        .historial-titulo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }


        .historial-titulo-icono {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 13px;
          background: #fff1f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }


        .historial-titulo h3 {
          margin: 0;
          color: #c7386f;
          font-size: 22px;
          font-weight: 800;
        }


        .historial-subtitulo {
          margin:
            0 0 22px 56px;
          color: #777777;
          font-size: 14px;
        }


        /* ==========================================
           TABLA
        ========================================== */

        .historial-tabla-wrapper {
          width: 100%;
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid #eee0e6;
          -webkit-overflow-scrolling: touch;
        }


        .historial-tabla {
          width: 100%;
          min-width: 650px;
          border-collapse: collapse;
          background: #ffffff;
        }


        .historial-tabla thead {
          background: #c7386f;
          color: #ffffff;
        }


        .historial-tabla th {
          padding: 15px 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .5px;
          text-transform: uppercase;
          white-space: nowrap;
        }


        .historial-tabla td {
          padding: 15px 14px;
          border-bottom:
            1px solid #f0e4e9;
          color: #4d4d4d;
          font-size: 14px;
          vertical-align: middle;
        }


        .historial-tabla tbody tr {
          transition:
            background .2s ease;
        }


        .historial-tabla tbody tr:hover {
          background: #fff8fb;
        }


        .historial-tabla tbody tr:last-child td {
          border-bottom: none;
        }


        /* ==========================================
           FECHA
        ========================================== */

        .historial-fecha {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          font-weight: 600;
          color: #555555;
        }


        /* ==========================================
           TIPO
        ========================================== */

        .historial-tipo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 11px;
          border-radius: 20px;
          background: #fff1f6;
          color: #c7386f;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }


        /* ==========================================
           MONTO
        ========================================== */

        .historial-monto {
          font-weight: 700;
          color: #444444;
          white-space: nowrap;
        }


        /* ==========================================
           PUNTOS
        ========================================== */

        .historial-puntos {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 20px;
          background: #fff8e8;
          color: #b87900;
          font-weight: 800;
          white-space: nowrap;
        }


        /* ==========================================
           HISTORIAL VACÍO
        ========================================== */

        .historial-vacio {
          text-align: center;
          padding: 35px 20px;
          color: #777777;
        }


        .historial-vacio-icono {
          font-size: 38px;
          margin-bottom: 10px;
        }


        .historial-vacio p {
          margin: 0;
          font-size: 15px;
        }


        /* ==========================================
           CELULAR
        ========================================== */

        @media (max-width: 700px) {

          #historialPuntos {
            margin-top: 30px;
          }


          .historial-contenedor {
            padding: 15px;
            border-radius: 17px;
          }


          .historial-titulo {
            gap: 10px;
          }


          .historial-titulo-icono {
            width: 40px;
            height: 40px;
            min-width: 40px;
            font-size: 20px;
          }


          .historial-titulo h3 {
            font-size: 19px;
          }


          .historial-subtitulo {
            margin:
              8px 0 18px 0;
            font-size: 13px;
            line-height: 1.5;
          }


          /*
             Ocultar encabezado
          */

          .historial-tabla-wrapper {
            border: none;
            overflow: visible;
          }


          .historial-tabla {
            width: 100%;
            min-width: 0;
            display: block;
          }


          .historial-tabla thead {
            display: none;
          }


          .historial-tabla tbody {
            display: block;
            width: 100%;
          }


          /*
             Cada movimiento es una tarjeta
          */

          .historial-tabla tr {
            display: block;
            width: 100%;
            margin-bottom: 14px;
            padding: 14px;
            box-sizing: border-box;
            border:
              1px solid #eadce2;
            border-radius: 15px;
            background: #ffffff;
            box-shadow:
              0 5px 15px rgba(0,0,0,.04);
          }


          .historial-tabla tr:last-child {
            margin-bottom: 0;
          }


          /*
             Cada dato de la tarjeta
          */

          .historial-tabla td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 9px 0;
            border-bottom:
              1px solid #f3e9ed;
            font-size: 14px;
            text-align: right;
          }


          .historial-tabla td:last-child {
            border-bottom: none;
          }


          /*
             Nombre del campo
          */

          .historial-tabla td::before {
            content: attr(data-label);
            font-weight: 700;
            color: #777777;
            text-align: left;
            flex-shrink: 0;
          }


          .historial-tabla td[data-label="Concepto"] {
            align-items: flex-start;
          }


          .historial-tabla td[data-label="Concepto"] {
            text-align: right;
          }


          .historial-tipo,
          .historial-puntos {
            margin-left: auto;
          }

        }


        /* ==========================================
           CELULARES MUY PEQUEÑOS
        ========================================== */

        @media (max-width: 400px) {

          .historial-contenedor {
            padding: 12px;
          }


          .historial-tabla tr {
            padding: 12px;
          }


          .historial-tabla td {
            font-size: 13px;
          }


          .historial-tipo,
          .historial-puntos {
            font-size: 11px;
            padding:
              5px 8px;
          }

        }

      `;


      document.head.appendChild(
        css
      );

    }


    // =================================================
    // VALIDAR HISTORIAL
    // =================================================

    if (
      !Array.isArray(historial) ||
      historial.length === 0
    ) {

      contenedor.innerHTML = `

        <div class="historial-contenedor">

          <div class="historial-titulo">

            <div class="historial-titulo-icono">
              📋
            </div>

            <h3>
              Historial de puntos
            </h3>

          </div>


          <div class="historial-vacio">

            <div class="historial-vacio-icono">
              📭
            </div>

            <p>
              Aún no tienes movimientos registrados.
            </p>

          </div>

        </div>

      `;

      return;

    }


    // =================================================
    // ORDENAR HISTORIAL
    // MÁS RECIENTE PRIMERO
    // =================================================

    const historialOrdenado =
      [...historial].reverse();


    // =================================================
    // GENERAR FILAS
    // =================================================

    let filas = "";


    historialOrdenado.forEach(
      function (movimiento) {

        // ---------------------------------------------
        // FECHA
        // ---------------------------------------------

        const fecha =
          movimiento.Fecha ??
          movimiento.fecha ??
          "";


        // ---------------------------------------------
        // TIPO
        // ---------------------------------------------

        const tipo =
          movimiento.Tipo ??
          movimiento.tipo ??
          "Movimiento";


        // ---------------------------------------------
        // CONCEPTO
        // ---------------------------------------------

        const concepto =
          movimiento.Concepto ??
          movimiento.concepto ??
          "-";


        // ---------------------------------------------
        // MONTO
        // ---------------------------------------------

        const monto =
          movimiento.Monto ??
          movimiento.monto ??
          0;


        // ---------------------------------------------
        // PUNTOS
        // ---------------------------------------------

        const puntos =
          movimiento.Puntos ??
          movimiento.puntos ??
          0;


        filas += `

          <tr>

            <td data-label="Fecha">

              <span class="historial-fecha">
                📅
                ${escapeHTML(fecha)}
              </span>

            </td>


            <td data-label="Tipo">

              <span class="historial-tipo">
                ${escapeHTML(tipo)}
              </span>

            </td>


            <td data-label="Concepto">

              ${escapeHTML(concepto)}

            </td>


            <td data-label="Monto">

              <span class="historial-monto">
                S/ ${formatearMonto(monto)}
              </span>

            </td>


            <td data-label="Puntos">

              <span class="historial-puntos">
                ⭐ +${escapeHTML(puntos)}
              </span>

            </td>

          </tr>

        `;

      }
    );


    // =================================================
    // MOSTRAR TABLA
    // =================================================

    contenedor.innerHTML = `

      <div class="historial-contenedor">


        <div class="historial-titulo">

          <div class="historial-titulo-icono">
            📋
          </div>

          <h3>
            Historial de puntos
          </h3>

        </div>


        <p class="historial-subtitulo">
          Aquí puedes revisar tus compras y
          servicios registrados.
        </p>


        <div class="historial-tabla-wrapper">

          <table class="historial-tabla">

            <thead>

              <tr>

                <th>
                  Fecha
                </th>

                <th>
                  Tipo
                </th>

                <th>
                  Concepto
                </th>

                <th>
                  Monto
                </th>

                <th>
                  Puntos
                </th>

              </tr>

            </thead>


            <tbody>

              ${filas}

            </tbody>

          </table>

        </div>


      </div>

    `;

  }


  // =====================================================
  // FORMATEAR MONTO
  // =====================================================

  function formatearMonto(
    valor
  ) {

    const numero =
      Number(valor) || 0;


    return numero.toFixed(2);

  }


  // =====================================================
  // ESCAPAR HTML
  // =====================================================

  function escapeHTML(
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


  // =====================================================
  // MOSTRAR MENSAJE
  // =====================================================

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
      "14px 18px";


    mensajePuntos.style.borderRadius =
      "12px";


    mensajePuntos.style.marginTop =
      "15px";


    mensajePuntos.style.textAlign =
      "center";


    mensajePuntos.style.fontWeight =
      "600";

  }


  // =====================================================
  // OCULTAR MENSAJE
  // =====================================================

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
