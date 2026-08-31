// ==========================================================
// JUANITA PACASMAYO
// CONSULTA DE PUNTOS
// ACCESO MEDIANTE CÓDIGO + PIN
// PUNTOS + PREMIOS + HISTORIAL
// ==========================================================


// ==========================================================
// URL GOOGLE APPS SCRIPT
// ==========================================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// ==========================================================
// CARGAR PÁGINA
// ==========================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {


    console.log(
      "consulta.js cargado correctamente"
    );


    const form =
      document.getElementById(
        "formConsulta"
      );


    const codigoInput =
      document.getElementById(
        "codigoCliente"
      );


    const pinInput =
      document.getElementById(
        "pinCliente"
      );


    const boton =
      document.getElementById(
        "btnConsultarPuntos"
      );


    const mensaje =
      document.getElementById(
        "mensajeConsulta"
      );


    const resultado =
      document.getElementById(
        "resultadoConsulta"
      );


    const nombre =
      document.getElementById(
        "nombreCliente"
      );


    const puntos =
      document.getElementById(
        "cantidadPuntos"
      );


    const historial =
      document.getElementById(
        "contenedorHistorial"
      );


    // ======================================================
    // FORMULARIO
    // ======================================================

    if (!form) {

      console.error(
        "No se encontró formConsulta"
      );

      return;

    }


    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        consultarCliente();

      }
    );


    // ======================================================
    // CONSULTAR CLIENTE
    // ======================================================

    async function consultarCliente() {


      const codigo =
        codigoInput
          .value
          .trim()
          .toUpperCase();


      const pin =
        pinInput
          .value
          .trim();


      ocultarMensaje();


      // ----------------------------------------------------
      // VALIDAR CÓDIGO
      // ----------------------------------------------------

      if (!codigo) {

        mostrarMensaje(
          "Ingresa tu código de cliente.",
          "error"
        );

        codigoInput.focus();

        return;

      }


      // ----------------------------------------------------
      // VALIDAR PIN
      // ----------------------------------------------------

      if (!pin) {

        mostrarMensaje(
          "Ingresa tu PIN.",
          "error"
        );

        pinInput.focus();

        return;

      }


      // ----------------------------------------------------
      // BOTÓN
      // ----------------------------------------------------

      const textoOriginal =
        boton.textContent;


      boton.disabled = true;

      boton.textContent =
        "🔄 Consultando...";


      try {


        // ==================================================
        // CONSULTAR PUNTOS
        // ==================================================

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


        const respuesta =
          await fetch(url);


        if (!respuesta.ok) {

          throw new Error(
            "Error de conexión con el servidor."
          );

        }


        const datos =
          await respuesta.json();


        console.log(
          "Respuesta:",
          datos
        );


        // ==================================================
        // VALIDACIÓN
        // ==================================================

        if (!datos.correcto) {

          throw new Error(
            datos.mensaje ||
            "Código o PIN incorrecto."
          );

        }


        // ==================================================
        // DATOS CLIENTE
        // ==================================================

        const nombreCliente =
          datos.cliente ||
          "Cliente";


        const puntosCliente =
          Number(
            datos.puntos
          ) || 0;


        nombre.textContent =
          nombreCliente;


        puntos.textContent =
          puntosCliente;


        // ==================================================
        // MOSTRAR RESULTADO
        // ==================================================

        resultado.style.display =
          "block";


        // ==================================================
        // PREMIOS
        // ==================================================

        actualizarPremios(
          puntosCliente
        );


        // ==================================================
        // HISTORIAL
        // ==================================================

        historial.innerHTML = `

          <div class="sin-historial">

            🔄 Cargando historial...

          </div>

        `;


        await cargarHistorial(
          codigo,
          pin
        );


        // ==================================================
        // MENSAJE
        // ==================================================

        mostrarMensaje(
          "¡Bienvenido! Consulta realizada correctamente.",
          "exito"
        );


        // ==================================================
        // SCROLL AL RESULTADO
        // ==================================================

        setTimeout(
          function () {

            resultado.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          },
          150
        );


      } catch (error) {


        console.error(
          "Error:",
          error
        );


        resultado.style.display =
          "none";


        mostrarMensaje(
          error.message ||
          "No se pudo realizar la consulta.",
          "error"
        );


      } finally {


        boton.disabled =
          false;


        boton.textContent =
          textoOriginal ||
          "🔐 Consultar mis puntos";

      }

    }


    // ======================================================
    // CARGAR HISTORIAL
    // ======================================================

    async function cargarHistorial(
      codigo,
      pin
    ) {


      try {


        const url =
          URL_APPS_SCRIPT +
          "?accion=historialCliente" +
          "&codigo=" +
          encodeURIComponent(codigo) +
          "&pin=" +
          encodeURIComponent(pin);


        console.log(
          "Consultando historial..."
        );


        const respuesta =
          await fetch(url);


        if (!respuesta.ok) {

          throw new Error(
            "No se pudo conectar con el historial."
          );

        }


        const datos =
          await respuesta.json();


        console.log(
          "Historial:",
          datos
        );


        if (!datos.correcto) {

          throw new Error(
            datos.mensaje ||
            "No se pudo cargar el historial."
          );

        }


        const movimientos =
          Array.isArray(
            datos.historial
          )
            ? datos.historial
            : [];


        renderizarHistorial(
          movimientos
        );


      } catch (error) {


        console.error(
          "Error historial:",
          error
        );


        historial.innerHTML = `

          <div class="sin-historial">

            📭

            <br><br>

            No se pudo cargar el historial.

          </div>

        `;

      }

    }


    // ======================================================
    // MOSTRAR HISTORIAL
    // ======================================================

    function renderizarHistorial(
      movimientos
    ) {


      if (
        !movimientos ||
        movimientos.length === 0
      ) {


        historial.innerHTML = `

          <div class="sin-historial">

            📭

            <br><br>

            Aún no tienes movimientos registrados.

          </div>

        `;


        return;

      }


      let filas = "";


      movimientos.forEach(
        function (movimiento) {


          const fecha =
            escaparHTML(
              movimiento.fecha ||
              ""
            );


          const tipo =
            escaparHTML(
              movimiento.tipo ||
              ""
            );


          const concepto =
            escaparHTML(
              movimiento.concepto ||
              ""
            );


          const observacion =
            escaparHTML(
              movimiento.observacion ||
              ""
            );


          const monto =
            Number(
              movimiento.monto
            ) || 0;


          const puntos =
            Number(
              movimiento.puntos
            ) || 0;


          filas += `

            <tr>

              <td>
                ${fecha}
              </td>

              <td>
                ${tipo}
              </td>

              <td>
                ${concepto}
              </td>

              <td class="monto">
                S/ ${monto.toFixed(2)}
              </td>

              <td class="puntos-ganados">
                +${puntos}
              </td>

              <td>
                ${observacion}
              </td>

            </tr>

          `;

        }
      );


      historial.innerHTML = `

        <div class="tabla-scroll">

          <table
            class="tabla-historial"
          >

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

                <th>
                  Observación
                </th>

              </tr>

            </thead>


            <tbody>

              ${filas}

            </tbody>

          </table>

        </div>

      `;

    }


    // ======================================================
    // PREMIOS
    // ======================================================

    function actualizarPremios(
      puntosCliente
    ) {


      const premios =
        document.querySelectorAll(
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


          const puntosPremio =
            parseInt(
              strong.textContent
                .replace(
                  /\D/g,
                  ""
                ),
              10
            );


          if (
            !puntosPremio
          ) {

            return;

          }


          const anterior =
            premio.querySelector(
              ".estado-premio"
            );


          if (anterior) {

            anterior.remove();

          }


          premio.classList.remove(
            "premio-disponible"
          );


          const estado =
            document.createElement(
              "div"
            );


          estado.className =
            "estado-premio";


          if (
            puntosCliente >=
            puntosPremio
          ) {


            premio.classList.add(
              "premio-disponible"
            );


            estado.textContent =
              "🎉 ¡Premio disponible!";


          } else {


            const faltan =
              puntosPremio -
              puntosCliente;


            estado.textContent =
              "Te faltan " +
              faltan +
              " puntos";

          }


          premio
            .querySelector("div")
            .appendChild(
              estado
            );

        }
      );

    }


    // ======================================================
    // MENSAJES
    // ======================================================

    function mostrarMensaje(
      texto,
      tipo
    ) {


      mensaje.textContent =
        texto;


      mensaje.className =
        "mensaje-consulta " +
        tipo;

    }


    function ocultarMensaje() {


      mensaje.textContent =
        "";


      mensaje.className =
        "mensaje-consulta";

    }


    // ======================================================
    // ESCAPAR HTML
    // ======================================================

    function escaparHTML(
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


  }
);
