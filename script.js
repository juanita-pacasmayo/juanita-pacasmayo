// =====================================================
// JUANITA PACASMAYO
// SCRIPT.JS
// CONSULTA DE PUNTOS
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
        ? codigoCliente.value.trim()
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


      const datos =
        await respuesta.json();


      console.log(
        "Respuesta:",
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
      // NOMBRE DEL CLIENTE
      // ===============================================

      if (nombreCliente) {

        nombreCliente.textContent =
          datos.cliente ||
          "Cliente";

      }


      // ===============================================
      // PUNTOS
      // ===============================================

      const puntos =
        Number(datos.puntos) || 0;


      if (cantidadPuntos) {

        cantidadPuntos.textContent =
          puntos;

      }


      // ===============================================
      // MOSTRAR RESULTADO
      // ===============================================

      if (resultadoPuntos) {

        resultadoPuntos.style.display =
          "block";

      }


      // ===============================================
      // ACTUALIZAR PREMIOS DEL HTML
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


      const descripcion =
        premio.querySelector("p");


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

    } else {

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

/* =====================================================
   MENÚ MÓVIL
   ===================================================== */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", function () {

    const abierto =
      mainNav.classList.toggle("menu-abierto");

    menuToggle.setAttribute(
      "aria-expanded",
      abierto ? "true" : "false"
    );

  });


  /* Cerrar menú al seleccionar una opción */

  mainNav.querySelectorAll("a").forEach(function (enlace) {

    enlace.addEventListener("click", function () {

      mainNav.classList.remove("menu-abierto");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}
