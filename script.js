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


  // ===================================================
  // ELEMENTOS DEL FORMULARIO
  // ===================================================

  const btnConsultarPuntos =
    document.getElementById("btnConsultarPuntos");

  const codigoCliente =
    document.getElementById("codigoCliente");

  // NUEVO: campo PIN
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
  // FUNCIÓN PRINCIPAL
  // CONSULTAR PUNTOS
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
    // OCULTAR MENSAJE
    // -------------------------------------------------

    ocultarMensaje();


    // -------------------------------------------------
    // OCULTAR RESULTADO ANTERIOR
    // -------------------------------------------------

    if (resultadoPuntos) {

      resultadoPuntos.style.display =
        "none";

    }


    // =================================================
    // VALIDAR CÓDIGO
    // =================================================

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


    // =================================================
    // VALIDAR PIN
    // =================================================

    if (!pin) {

      mostrarMensaje(
        "Por favor, ingresa tu PIN.",
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
      "Verificando...";


    // =================================================
    // CONSULTAR GOOGLE APPS SCRIPT
    // =================================================

    try {

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
          "Error de conexión con el servidor. Código HTTP: " +
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
      // COMPROBAR AUTENTICACIÓN
      // =================================================

      if (!datos.correcto) {

        throw new Error(
          datos.mensaje ||
          "Código de cliente o PIN incorrecto."
        );

      }


      // =================================================
      // OBTENER NOMBRE
      // =================================================

      const nombre =
        datos.cliente ||
        datos.nombre ||
        datos.Nombre ||
        "Cliente";


      // =================================================
      // OBTENER PUNTOS
      // =================================================

      const puntos =
        Number(datos.puntos) || 0;


      console.log(
        "Cliente autenticado:",
        nombre
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
      // IMPORTANTE
      // =================================================
      // NO MOSTRAMOS EL PIN
      // NO MOSTRAMOS EL CÓDIGO
      // EL PIN SOLO SIRVE PARA AUTENTICAR
      // =================================================


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

      actualizarPremios(puntos);


      // =================================================
      // MENSAJE DE ÉXITO
      // =================================================

      mostrarMensaje(
        "¡Bienvenido! Consulta realizada correctamente.",
        "exito"
      );


      // =================================================
      // LIMPIAR PIN DESPUÉS DE INGRESAR
      // =================================================

      if (pinCliente) {

        pinCliente.value = "";

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

      // =================================================
      // RESTAURAR BOTÓN
      // =================================================

      btnConsultarPuntos.disabled =
        false;

      btnConsultarPuntos.textContent =
        textoOriginal ||
        "Consultar mis puntos";

    }

  }


  // =====================================================
  // ACTUALIZAR PREMIOS
  // =====================================================

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

      // -------------------------------------------------
      // BUSCAR PUNTOS DEL PREMIO
      // -------------------------------------------------

      const strong =
        premio.querySelector("strong");


      if (!strong) {
        return;
      }


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


      // -------------------------------------------------
      // ELIMINAR MENSAJE ANTERIOR
      // -------------------------------------------------

      const mensajeAnterior =
        premio.querySelector(
          ".estado-premio"
        );


      if (mensajeAnterior) {

        mensajeAnterior.remove();

      }


      // =================================================
      // PREMIO DISPONIBLE
      // =================================================

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


      // =================================================
      // PREMIO BLOQUEADO
      // =================================================

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
      "10px 15px";

    mensajePuntos.style.borderRadius =
      "10px";

    mensajePuntos.style.marginTop =
      "15px";

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


  // ===================================================
  // CERRAR MENÚ AL SELECCIONAR UNA OPCIÓN
  // ===================================================

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
