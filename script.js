// =====================================================
// JUANITA PACASMAYO
// SCRIPT.JS COMPLETO
// CONSULTA DE PUNTOS Y PREMIOS
// =====================================================


// =====================================================
// URL DE TU WEB APP DE GOOGLE APPS SCRIPT
// =====================================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// =====================================================
// INICIAR CUANDO CARGUE LA PÁGINA
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("script.js cargado correctamente");


  // ---------------------------------------------------
  // ELEMENTOS DE LA PÁGINA
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
      "No se encontró el botón #btnConsultarPuntos"
    );

    return;
  }


  // ===================================================
  // BOTÓN CONSULTAR MIS PUNTOS
  // ===================================================

  btnConsultarPuntos.addEventListener(
    "click",
    consultarCliente
  );


  // ===================================================
  // PERMITIR CONSULTAR PRESIONANDO ENTER
  // ===================================================

  if (codigoCliente) {

    codigoCliente.addEventListener(
      "keypress",
      function (event) {

        if (event.key === "Enter") {

          event.preventDefault();

          consultarCliente();

        }

      }
    );

  }


  // ===================================================
  // FUNCIÓN PRINCIPAL
  // ===================================================

  async function consultarCliente() {

    const codigo =
      codigoCliente
        ? codigoCliente.value.trim()
        : "";


    // -------------------------------------------------
    // LIMPIAR RESULTADOS ANTERIORES
    // -------------------------------------------------

    ocultarMensaje();

    ocultarResultado();


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
    // BOTÓN EN ESTADO CARGANDO
    // -------------------------------------------------

    btnConsultarPuntos.disabled = true;

    const textoOriginal =
      btnConsultarPuntos.textContent;

    btnConsultarPuntos.textContent =
      "Consultando...";


    try {

      // ===============================================
      // CONSULTAR CLIENTE
      // ===============================================

      const urlCliente =
        URL_APPS_SCRIPT +
        "?accion=consultarPuntos&codigo=" +
        encodeURIComponent(codigo);


      console.log(
        "Consultando cliente:",
        urlCliente
      );


      const respuestaCliente =
        await fetch(urlCliente);


      if (!respuestaCliente.ok) {

        throw new Error(
          "Error HTTP: " +
          respuestaCliente.status
        );

      }


      const datosCliente =
        await respuestaCliente.json();


      console.log(
        "Respuesta cliente:",
        datosCliente
      );


      // ===============================================
      // COMPROBAR RESPUESTA
      // ===============================================

      if (!datosCliente.correcto) {

        throw new Error(
          datosCliente.mensaje ||
          "No se encontró el cliente."
        );

      }


      // ===============================================
      // MOSTRAR NOMBRE
      //
      // IMPORTANTE:
      // Tu Código.gs devuelve:
      //
      // cliente: resultado.nombre
      //
      // NO devuelve:
      //
      // nombre: resultado.nombre
      // ===============================================

      if (nombreCliente) {

        nombreCliente.textContent =
          datosCliente.cliente ||
          "Cliente";

      }


      // ===============================================
      // MOSTRAR PUNTOS
      // ===============================================

      const puntos =
        Number(datosCliente.puntos) || 0;


      if (cantidadPuntos) {

        cantidadPuntos.textContent =
          puntos;

      }


      // ===============================================
      // MOSTRAR RESULTADO PRINCIPAL
      // ===============================================

      if (resultadoPuntos) {

        resultadoPuntos.style.display =
          "block";

      }


      // ===============================================
      // CONSULTAR PREMIOS
      // ===============================================

      await cargarPremios(codigo, puntos);


      // ===============================================
      // MENSAJE DE ÉXITO
      // ===============================================

      mostrarMensaje(
        "Consulta realizada correctamente.",
        "exito"
      );


    } catch (error) {

      console.error(
        "Error al consultar puntos:",
        error
      );


      ocultarResultado();


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
  // CARGAR PREMIOS
  // ===================================================

  async function cargarPremios(
    codigo,
    puntosCliente
  ) {

    try {

      const urlPremios =
        URL_APPS_SCRIPT +
        "?accion=premiosDisponibles&codigo=" +
        encodeURIComponent(codigo);


      console.log(
        "Consultando premios:",
        urlPremios
      );


      const respuestaPremios =
        await fetch(urlPremios);


      if (!respuestaPremios.ok) {

        throw new Error(
          "No se pudieron consultar los premios."
        );

      }


      const datosPremios =
        await respuestaPremios.json();


      console.log(
        "Respuesta premios:",
        datosPremios
      );


      if (!datosPremios.correcto) {

        console.warn(
          "No se pudieron cargar los premios:",
          datosPremios.mensaje
        );

        mostrarPremiosPorDefecto(
          puntosCliente
        );

        return;

      }


      // ===============================================
      // MOSTRAR PREMIOS
      // ===============================================

      mostrarPremios(
        datosPremios.disponibles || [],
        datosPremios.bloqueados || [],
        puntosCliente
      );


    } catch (error) {

      console.error(
        "Error al cargar premios:",
        error
      );


      // Si falla la consulta de premios,
      // mantenemos la página funcionando.

      mostrarPremiosPorDefecto(
        puntosCliente
      );

    }

  }


  // ===================================================
  // MOSTRAR PREMIOS
  // ===================================================

  function mostrarPremios(
    disponibles,
    bloqueados,
    puntosCliente
  ) {

    const contenedor =
      obtenerContenedorPremios();


    if (!contenedor) {

      console.warn(
        "No se encontró un contenedor para los premios."
      );

      return;

    }


    let html = "";


    // ===============================================
    // TÍTULO
    // ===============================================

    html += `
      <div class="titulo-premios">
        🎁 <strong>Premios</strong>
      </div>
    `;


    // ===============================================
    // PREMIOS DISPONIBLES
    // ===============================================

    if (disponibles.length > 0) {

      html += `
        <div class="premios-disponibles">
          <h3>🏆 Premios disponibles</h3>
      `;


      disponibles.forEach(function (premio) {

        html += `
          <div class="premio disponible">

            <div class="premio-icono">
              ${obtenerIconoPremio(premio.nombre)}
            </div>

            <div class="premio-info">

              <strong>
                ${escaparHTML(premio.puntos)}
                puntos
              </strong>

              <span>
                ${escaparHTML(premio.nombre)}
              </span>

              ${
                premio.descripcion
                  ? `
                    <small>
                      ${escaparHTML(
                        premio.descripcion
                      )}
                    </small>
                  `
                  : ""
              }

              <b>
                🎉 ¡Puedes reclamar este premio!
              </b>

            </div>

          </div>
        `;

      });


      html += `
        </div>
      `;

    }


    // ===============================================
    // PREMIOS QUE FALTAN
    // ===============================================

    if (bloqueados.length > 0) {

      html += `
        <div class="premios-pendientes">
          <h3>🎁 Próximos premios</h3>
      `;


      bloqueados.forEach(function (premio) {

        const faltan =
          Number(premio.puntosFaltantes) ||
          Math.max(
            0,
            Number(premio.puntos) -
            Number(puntosCliente)
          );


        html += `
          <div class="premio pendiente">

            <div class="premio-icono">
              ${obtenerIconoPremio(premio.nombre)}
            </div>

            <div class="premio-info">

              <strong>
                ${escaparHTML(premio.puntos)}
                puntos
              </strong>

              <span>
                ${escaparHTML(premio.nombre)}
              </span>

              ${
                premio.descripcion
                  ? `
                    <small>
                      ${escaparHTML(
                        premio.descripcion
                      )}
                    </small>
                  `
                  : ""
              }

              <small>
                Te faltan
                <strong>
                  ${escaparHTML(faltan)}
                puntos
                </strong>
              </small>

            </div>

          </div>
        `;

      });


      html += `
        </div>
      `;

    }


    // ===============================================
    // SI NO HAY PREMIOS
    // ===============================================

    if (
      disponibles.length === 0 &&
      bloqueados.length === 0
    ) {

      html += `
        <p>
          Actualmente no hay premios disponibles.
        </p>
      `;

    }


    contenedor.innerHTML =
      html;

  }


  // ===================================================
  // CONTENEDOR DE PREMIOS
  // ===================================================

  function obtenerContenedorPremios() {

    // Primero intenta encontrar un contenedor
    // que ya exista en tu HTML.

    let contenedor =
      document.getElementById(
        "premiosResultado"
      );


    if (contenedor) {
      return contenedor;
    }


    contenedor =
      document.getElementById(
        "listaPremios"
      );


    if (contenedor) {
      return contenedor;
    }


    contenedor =
      document.getElementById(
        "premios"
      );


    if (contenedor) {
      return contenedor;
    }


    // Si no existe ninguno, lo crea automáticamente.

    if (resultadoPuntos) {

      contenedor =
        document.createElement("div");

      contenedor.id =
        "premiosResultado";

      contenedor.className =
        "premios-resultado";


      resultadoPuntos.appendChild(
        contenedor
      );


      return contenedor;

    }


    return null;

  }


  // ===================================================
  // PREMIOS POR DEFECTO
  // ===================================================

  function mostrarPremiosPorDefecto(
    puntosCliente
  ) {

    const premios = [

      {
        puntos: 150,
        nombre: "Regalos cosméticos"
      },

      {
        puntos: 200,
        nombre: "Lentes de sol"
      },

      {
        puntos: 300,
        nombre: "Pestañas 1x1 gratis"
      },

      {
        puntos: 350,
        nombre: "Gorra o billetera"
      }

    ];


    const disponibles =
      premios.filter(function (premio) {

        return puntosCliente >= premio.puntos;

      });


    const bloqueados =
      premios
        .filter(function (premio) {

          return puntosCliente < premio.puntos;

        })
        .map(function (premio) {

          return {

            ...premio,

            puntosFaltantes:
              premio.puntos -
              puntosCliente

          };

        });


    mostrarPremios(
      disponibles,
      bloqueados,
      puntosCliente
    );

  }


  // ===================================================
  // ICONOS DE PREMIOS
  // ===================================================

  function obtenerIconoPremio(
    nombre
  ) {

    const texto =
      String(nombre || "")
        .toLowerCase();


    if (
      texto.includes("cosmét") ||
      texto.includes("cosmet")
    ) {

      return "💄";

    }


    if (
      texto.includes("lente") ||
      texto.includes("sol")
    ) {

      return "🕶️";

    }


    if (
      texto.includes("pestaña") ||
      texto.includes("pestana")
    ) {

      return "👁️";

    }


    if (
      texto.includes("gorra") ||
      texto.includes("billetera")
    ) {

      return "🧢";

    }


    return "🎁";

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


  // ===================================================
  // OCULTAR RESULTADO
  // ===================================================

  function ocultarResultado() {

    if (resultadoPuntos) {

      resultadoPuntos.style.display =
        "none";

    }

  }


  // ===================================================
  // SEGURIDAD: ESCAPAR HTML
  // ===================================================

  function escaparHTML(valor) {

    const div =
      document.createElement("div");


    div.textContent =
      String(valor ?? "");


    return div.innerHTML;

  }

});
