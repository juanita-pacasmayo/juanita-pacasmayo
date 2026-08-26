```javascript
// ==========================================
// MENÚ PRINCIPAL
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", () => {

    mainNav.classList.toggle("open");

    const abierto =
      mainNav.classList.contains("open");

    menuToggle.setAttribute(
      "aria-expanded",
      abierto
    );
  });

}


document.querySelectorAll(".main-nav a").forEach((enlace) => {

  enlace.addEventListener("click", () => {

    if (mainNav) {
      mainNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }

  });

});


// ==========================================
// CONEXIÓN CON APPS SCRIPT
// ==========================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


fetch(URL_APPS_SCRIPT)

  .then(response => {

    if (!response.ok) {

      throw new Error(
        "HTTP " + response.status
      );

    }

    return response.json();

  })

  .then(data => {

    console.log(
      "✅ Respuesta de Apps Script:",
      data
    );

  })

  .catch(error => {

    console.error(
      "❌ Error conectando con Apps Script:",
      error
    );

  });


// ==========================================
// ELEMENTOS DE CONSULTA DE PUNTOS
// ==========================================

const btnConsultarPuntos =
  document.getElementById(
    "btnConsultarPuntos"
  );

const codigoClienteInput =
  document.getElementById(
    "codigoCliente"
  );

const mensajePuntos =
  document.getElementById(
    "mensajePuntos"
  );

const resultadoPuntos =
  document.getElementById(
    "resultadoPuntos"
  );

const nombreCliente =
  document.getElementById(
    "nombreCliente"
  );

const cantidadPuntos =
  document.getElementById(
    "cantidadPuntos"
  );


// ==========================================
// BOTÓN CONSULTAR
// ==========================================

if (btnConsultarPuntos) {

  btnConsultarPuntos.addEventListener(
    "click",
    consultarPuntosWeb
  );

}


// ==========================================
// CONSULTAR PUNTOS Y PREMIOS
// ==========================================

function consultarPuntosWeb() {

  // ==========================================
  // OBTENER CÓDIGO
  // ==========================================

  const codigo =
    codigoClienteInput.value
      .trim()
      .toUpperCase();


  // ==========================================
  // LIMPIAR RESULTADOS ANTERIORES
  // ==========================================

  mensajePuntos.textContent = "";

  resultadoPuntos.style.display =
    "none";


  // ==========================================
  // VALIDAR CÓDIGO
  // ==========================================

  if (!codigo) {

    mensajePuntos.textContent =
      "Por favor, ingresa tu código de cliente.";

    return;

  }


  // ==========================================
  // MENSAJE DE CARGA
  // ==========================================

  mensajePuntos.textContent =
    "Consultando tus puntos...";


  // ==========================================
  // URL PARA CONSULTAR PUNTOS
  // ==========================================

  const urlPuntos =
    URL_APPS_SCRIPT +
    "?accion=consultarPuntos&codigo=" +
    encodeURIComponent(codigo);


  // ==========================================
  // CONSULTAR PUNTOS
  // ==========================================

  fetch(urlPuntos)

    .then(response => {

      if (!response.ok) {

        throw new Error(
          "Error HTTP: " +
          response.status
        );

      }

      return response.json();

    })


    .then(data => {

      console.log(
        "✅ Resultado consulta puntos:",
        data
      );


      // ==========================================
      // COMPROBAR RESPUESTA
      // ==========================================

      if (!data.correcto) {

        mensajePuntos.textContent =
          data.mensaje ||
          "No se pudo consultar los puntos.";

        return;

      }


      // ==========================================
      // MOSTRAR NOMBRE
      // ==========================================

      nombreCliente.textContent =
        data.cliente;


      // ==========================================
      // MOSTRAR PUNTOS
      // ==========================================

      cantidadPuntos.textContent =
        data.puntos;


      // ==========================================
      // MOSTRAR RESULTADO
      // ==========================================

      resultadoPuntos.style.display =
        "block";


      // ==========================================
      // CONSULTAR PREMIOS
      // ==========================================

      mensajePuntos.textContent =
        "Consultando premios...";


      const urlPremios =
        URL_APPS_SCRIPT +
        "?accion=premiosDisponibles&codigo=" +
        encodeURIComponent(codigo);


      return fetch(urlPremios);

    })


    // ==========================================
    // RESPUESTA DE PREMIOS
    // ==========================================

    .then(response => {

      if (!response) {

        return null;

      }


      if (!response.ok) {

        throw new Error(
          "Error HTTP premios: " +
          response.status
        );

      }


      return response.json();

    })


    // ==========================================
    // PROCESAR PREMIOS
    // ==========================================

    .then(dataPremios => {

      if (!dataPremios) {

        return;

      }


      console.log(
        "🎁 Resultado premios:",
        dataPremios
      );


      // ==========================================
      // COMPROBAR RESPUESTA
      // ==========================================

      if (!dataPremios.correcto) {

        mensajePuntos.textContent =
          dataPremios.mensaje ||
          "No se pudieron consultar los premios.";

        return;

      }


      // ==========================================
      // BUSCAR LISTA DE PREMIOS EN HTML
      // ==========================================

      const listaPremios =
        document.querySelector(
          ".premios-lista"
        );


      if (!listaPremios) {

        console.error(
          "❌ No se encontró .premios-lista en el HTML."
        );

        return;

      }


      // ==========================================
      // BORRAR PREMIOS ANTERIORES
      // ==========================================

      listaPremios.innerHTML = "";


      // ==========================================
      // PREMIOS DISPONIBLES
      // ==========================================

      if (
        dataPremios.disponibles &&
        dataPremios.disponibles.length > 0
      ) {

        dataPremios.disponibles.forEach(
          function(premio) {

            const elemento =
              document.createElement(
                "div"
              );


            elemento.className =
              "premio premio-disponible";


            elemento.innerHTML = `

              <span>🎁</span>

              <div>

                <strong>
                  ${premio.puntos} puntos
                </strong>

                <p>
                  ${premio.nombre}
                </p>

                <small>
                  ✅ ¡Premio disponible!
                </small>

              </div>

            `;


            listaPremios.appendChild(
              elemento
            );

          }
        );

      }


      // ==========================================
      // PREMIOS BLOQUEADOS
      // ==========================================

      if (
        dataPremios.bloqueados &&
        dataPremios.bloqueados.length > 0
      ) {

        dataPremios.bloqueados.forEach(
          function(premio) {

            const elemento =
              document.createElement(
                "div"
              );


            elemento.className =
              "premio premio-bloqueado";


            elemento.innerHTML = `

              <span>🔒</span>

              <div>

                <strong>
                  ${premio.puntos} puntos
                </strong>

                <p>
                  ${premio.nombre}
                </p>

                <small>
                  Te faltan
                  <strong>
                    ${premio.puntosFaltantes}
                  </strong>
                  puntos
                </small>

              </div>

            `;


            listaPremios.appendChild(
              elemento
            );

          }
        );

      }


      // ==========================================
      // LIMPIAR MENSAJE
      // ==========================================

      mensajePuntos.textContent = "";

    })


    // ==========================================
    // MANEJO DE ERRORES
    // ==========================================

    .catch(error => {

      console.error(
        "❌ Error consultando puntos o premios:",
        error
      );


      mensajePuntos.textContent =
        "No se pudo conectar con el sistema de puntos. Inténtalo nuevamente.";

    });

}
```
