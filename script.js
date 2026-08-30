// =====================================================
// JUANITA PACASMAYO
// SCRIPT.JS
// CONSULTA DE PUNTOS + CÓDIGO + PIN
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


  // ---------------------------------------------------
  // ELEMENTOS
  // ---------------------------------------------------

  const btnConsultarPuntos =
    document.getElementById("btnConsultarPuntos");

  const codigoCliente =
    document.getElementById("codigoCliente");

  const mensajePuntos =
    document.getElementById("mensajePuntos");

  const resultadoPuntos =
    document.getElementById("resultadoPuntos");

  const nombreCliente =
    document.getElementById("nombreCliente");

  const cantidadPuntos =
    document.getElementById("cantidadPuntos");


  // ---------------------------------------------------
  // COMPROBAR BOTÓN
  // ---------------------------------------------------

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
  // ENTER EN EL CAMPO DE CÓDIGO
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
  // CONSULTAR CLIENTE
  // ===================================================

  async function consultarPuntos() {

    const codigo =
      codigoCliente
        ? codigoCliente.value.trim().toUpperCase()
        : "";


    // -------------------------------------------------
    // LIMPIAR
    // -------------------------------------------------

    ocultarMensaje();


    // -------------------------------------------------
    // VALIDAR
    // -------------------------------------------------

    if (!codigo) {

      mostrarMensaje(
        "Por favor, ingresa tu código de cliente.",
        "error"
      );

      return;
    }


    // -------------------------------------------------
    // BOTÓN CARGANDO
    // -------------------------------------------------

    const textoOriginal =
      btnConsultarPuntos.textContent;

    btnConsultarPuntos.disabled = true;

    btnConsultarPuntos.textContent =
      "Consultando...";


    try {

      // ===============================================
      // URL
      // ===============================================

      const url =
        URL_APPS_SCRIPT +
        "?accion=consultarPuntos&codigo=" +
        encodeURIComponent(codigo);


      console.log(
        "Consultando:",
        url
      );


      // ===============================================
      // FETCH
      // ===============================================

      const respuesta =
        await fetch(url);


      if (!respuesta.ok) {

        throw new Error(
          "Error HTTP: " +
          respuesta.status
        );

      }


      // ===============================================
      // RESPUESTA JSON
      // ===============================================

      const datos =
        await respuesta.json();


      console.log(
        "Respuesta de Google Apps Script:",
        datos
      );


      // ===============================================
      // COMPROBAR RESPUESTA
      // ===============================================

      if (!datos.correcto) {

        throw new Error(
          datos.mensaje ||
          "No se encontró el cliente."
        );

      }


      // ===============================================
      // OBTENER DATOS DEL CLIENTE
      // ===============================================

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


      const pin =
        datos.pin ||
        datos.PIN ||
        datos.Pin ||
        datos.contrasena ||
        datos.contraseña ||
        datos.password ||
        "";


      const puntos =
        Number(datos.puntos) || 0;


      console.log("Nombre:", nombre);

      console.log("Código:", codigoResultado);

      console.log("PIN:", pin);

      console.log("Puntos:", puntos);


      // ===============================================
      // NOMBRE DEL CLIENTE
      // ===============================================

      if (nombreCliente) {

        nombreCliente.textContent =
          nombre;

      }


      // ===============================================
      // PUNTOS
      // ===============================================

      if (cantidadPuntos) {

        cantidadPuntos.textContent =
          puntos;

      }


      // ===============================================
      // MOSTRAR CÓDIGO Y PIN
      // ===============================================

      mostrarDatosAcceso(
        codigoResultado,
        pin
      );


      // ===============================================
      // MOSTRAR RESULTADO
      // ===============================================

      if (resultadoPuntos) {

        resultadoPuntos.style.display =
          "block";

      }


      // ===============================================
      // ACTUALIZAR PREMIOS
      // ===============================================

      actualizarPremios(puntos);


      // ===============================================
      // MENSAJE
      // ===============================================

      mostrarMensaje(
        "Consulta realizada correctamente.",
        "exito"
      );


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
        "Consultar mis puntos";

    }

  }


  // ===================================================
  // MOSTRAR CÓDIGO Y PIN DEL CLIENTE
  // ===================================================

  function mostrarDatosAcceso(codigo, pin) {

    if (!resultadoPuntos) {
      return;
    }


    // -------------------------------------------------
    // BUSCAR SI YA EXISTE EL BLOQUE
    // -------------------------------------------------

    let acceso =
      document.getElementById(
        "datosAccesoCliente"
      );


    // -------------------------------------------------
    // SI NO EXISTE, CREARLO AUTOMÁTICAMENTE
    // -------------------------------------------------

    if (!acceso) {

      acceso =
        document.createElement("div");

      acceso.id =
        "datosAccesoCliente";

      acceso.style.marginTop =
        "25px";

      acceso.style.padding =
        "22px";

      acceso.style.borderRadius =
        "18px";

      acceso.style.background =
        "linear-gradient(135deg, #fff7fa, #ffffff)";

      acceso.style.border =
        "1px solid #e7b1c5";

      acceso.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.08)";

      acceso.style.textAlign =
        "center";


      resultadoPuntos.appendChild(
        acceso
      );

    }


    // -------------------------------------------------
    // CONTENIDO
    // -------------------------------------------------

    acceso.innerHTML = `

      <div style="
        font-size: 13px;
        letter-spacing: 2px;
        color: #c7386f;
        font-weight: 700;
        margin-bottom: 8px;
      ">
        🔐 DATOS DE ACCESO
      </div>

      <div style="
        font-size: 15px;
        color: #555;
        margin-bottom: 18px;
      ">
        Guarda estos datos para futuras consultas.
      </div>


      <div style="
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
      ">


        <!-- CÓDIGO -->

        <div style="
          min-width: 200px;
          padding: 15px 20px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #ead1db;
        ">

          <div style="
            font-size: 12px;
            color: #777;
            margin-bottom: 6px;
          ">
            CÓDIGO DE CLIENTE
          </div>

          <div style="
            font-size: 24px;
            font-weight: 800;
            color: #c7386f;
            letter-spacing: 1px;
          ">
            ${escapeHTML(codigo)}
          </div>

        </div>


        <!-- PIN -->

        <div style="
          min-width: 200px;
          padding: 15px 20px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #ead1db;
        ">

          <div style="
            font-size: 12px;
            color: #777;
            margin-bottom: 6px;
          ">
            PIN / CONTRASEÑA
          </div>

          <div style="
            font-size: 24px;
            font-weight: 800;
            color: #333;
            letter-spacing: 4px;
          ">
            ${pin
              ? escapeHTML(String(pin))
              : "No disponible"}
          </div>

        </div>


      </div>

    `;

  }


  // ===================================================
  // PROTEGER TEXTO HTML
  // ===================================================

  function escapeHTML(text) {

    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  // ===================================================
  // ACTUALIZAR PREMIOS
  // ===================================================

  function actualizarPremios(puntosCliente) {

    const lista =
      document.querySelector(".premios-lista");


    if (!lista) {

      console.warn(
        "No se encontró .premios-lista"
      );

      return;

    }


    const premios =
      lista.querySelectorAll(".premio");


    premios.forEach(function (premio) {

      const strong =
        premio.querySelector("strong");


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
          textoPuntos.replace(/\D/g, ""),
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

      if (puntosCliente >= puntosPremio) {

        premio.classList.add(
          "premio-disponible"
        );


        const mensaje =
          document.createElement("div");


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
          document.createElement("div");


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

    }

    else {

      mensajePuntos.style.color =
        "#2e7d32";

    }

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
  document.querySelector(".menu-toggle");

const mainNav =
  document.querySelector(".main-nav");


if (menuToggle && mainNav) {

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
  // CERRAR MENÚ AL SELECCIONAR UNA OPCIÓN
  // ---------------------------------------------------

  mainNav
    .querySelectorAll("a")
    .forEach(function (enlace) {

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

    });

}
