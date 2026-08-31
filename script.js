// ==========================================================
// JUANITA PACASMAYO
// SCRIPT.JS COMPLETO
// ==========================================================
//
// FUNCIONES:
//
// 1. MENÚ PRINCIPAL
// 2. CONSULTA DE PUNTOS
// 3. VALIDACIÓN CÓDIGO + PIN
// 4. PREMIOS
// 5. HISTORIAL
// 6. COMPATIBILIDAD CON ADMINISTRACIÓN
//
// ==========================================================


// ==========================================================
// URL DE GOOGLE APPS SCRIPT
// ==========================================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// ==========================================================
// CUANDO CARGA EL DOCUMENTO
// ==========================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    console.log(
      "✅ Juanita Pacasmayo - script.js cargado"
    );


    // ======================================================
    // MENÚ MÓVIL
    // ======================================================

    inicializarMenu();


    // ======================================================
    // CONSULTA DE PUNTOS
    // ======================================================

    inicializarConsultaPuntos();


    // ======================================================
    // ADMINISTRACIÓN
    // ======================================================

    inicializarAdministracion();

  }
);


// ==========================================================
// MENÚ MÓVIL
// ==========================================================

function inicializarMenu() {

  const menuToggle =
    document.querySelector(
      ".menu-toggle"
    );


  const mainNav =
    document.querySelector(
      ".main-nav"
    );


  if (
    !menuToggle ||
    !mainNav
  ) {

    return;

  }


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


  const enlaces =
    mainNav.querySelectorAll(
      "a"
    );


  enlaces.forEach(
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


// ==========================================================
// INICIALIZAR CONSULTA DE PUNTOS
// ==========================================================

function inicializarConsultaPuntos() {

  const formulario =
    document.getElementById(
      "formConsultaPuntos"
    );


  if (!formulario) {

    // Esta página no es puntos.html

    return;

  }


  console.log(
    "🔐 Módulo de consulta de puntos activo"
  );


  formulario.addEventListener(
    "submit",
    function (evento) {

      evento.preventDefault();

      consultarPuntosCliente();

    }
  );


  // ========================================================
  // ENTER EN CÓDIGO
  // ========================================================

  const codigo =
    document.getElementById(
      "codigoCliente"
    );


  if (codigo) {

    codigo.addEventListener(
      "input",
      function () {

        this.value =
          this.value
            .toUpperCase();

      }
    );

  }

}


// ==========================================================
// CONSULTAR PUNTOS DEL CLIENTE
// ==========================================================

async function consultarPuntosCliente() {

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


  const resultado =
    document.getElementById(
      "resultadoCliente"
    );


  const codigo =
    codigoInput
      ? codigoInput.value
          .trim()
          .toUpperCase()
      : "";


  const pin =
    pinInput
      ? pinInput.value.trim()
      : "";


  // ========================================================
  // LIMPIAR RESULTADO ANTERIOR
  // ========================================================

  if (resultado) {

    resultado.style.display =
      "none";

  }


  ocultarMensajePuntos();


  // ========================================================
  // VALIDAR CÓDIGO
  // ========================================================

  if (!codigo) {

    mostrarMensajePuntos(
      "Por favor, ingresa tu código de cliente.",
      "error"
    );

    if (codigoInput) {
      codigoInput.focus();
    }

    return;

  }


  // ========================================================
  // VALIDAR PIN
  // ========================================================

  if (!pin) {

    mostrarMensajePuntos(
      "Por favor, ingresa tu PIN.",
      "error"
    );

    if (pinInput) {
      pinInput.focus();
    }

    return;

  }


  // ========================================================
  // BOTÓN CARGANDO
  // ========================================================

  let textoOriginal =
    "🔐 Consultar mis puntos";


  if (boton) {

    textoOriginal =
      boton.textContent;

    boton.disabled =
      true;

    boton.textContent =
      "⏳ Consultando...";

  }


  try {

    // ======================================================
    // CONSTRUIR URL
    // ======================================================

    const parametros =
      new URLSearchParams();


    parametros.append(
      "accion",
      "consultarPuntos"
    );


    parametros.append(
      "codigo",
      codigo
    );


    parametros.append(
      "pin",
      pin
    );


    const url =
      URL_APPS_SCRIPT +
      "?" +
      parametros.toString();


    console.log(
      "🔎 Consultando cliente:",
      codigo
    );


    // ======================================================
    // FETCH
    // ======================================================

    const respuesta =
      await fetch(
        url,
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    if (!respuesta.ok) {

      throw new Error(
        "Error de conexión. Código HTTP: " +
        respuesta.status
      );

    }


    // ======================================================
    // LEER JSON
    // ======================================================

    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    console.log(
      "📦 Respuesta:",
      datos
    );


    // ======================================================
    // VALIDAR RESPUESTA
    // ======================================================

    if (
      !datos ||
      !datos.correcto
    ) {

      throw new Error(
        datos &&
        datos.mensaje
          ? datos.mensaje
          : "Código de cliente o PIN incorrecto."
      );

    }


    // ======================================================
    // MOSTRAR DATOS DEL CLIENTE
    // ======================================================

    mostrarDatosCliente(
      datos
    );


    // ======================================================
    // MOSTRAR HISTORIAL
    // ======================================================

    mostrarHistorial(
      datos.historial || []
    );


    // ======================================================
    // CARGAR PREMIOS
    // ======================================================

    await cargarPremiosCliente(
      codigo,
      pin,
      Number(
        datos.puntos
      ) || 0
    );


    // ======================================================
    // MOSTRAR RESULTADO
    // ======================================================

    if (resultado) {

      resultado.style.display =
        "block";

    }


    mostrarMensajePuntos(
      "✅ Consulta realizada correctamente.",
      "exito"
    );


    // ======================================================
    // DESPLAZAR A RESULTADO
    // ======================================================

    setTimeout(
      function () {

        if (resultado) {

          resultado.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      },
      200
    );


  } catch (error) {

    console.error(
      "❌ Error consulta puntos:",
      error
    );


    if (resultado) {

      resultado.style.display =
        "none";

    }


    mostrarMensajePuntos(
      error.message ||
      "No se pudo realizar la consulta.",
      "error"
    );


  } finally {

    if (boton) {

      boton.disabled =
        false;

      boton.textContent =
        textoOriginal;

    }

  }

}


// ==========================================================
// MOSTRAR DATOS DEL CLIENTE
// ==========================================================

function mostrarDatosCliente(
  datos
) {

  const nombre =
    document.getElementById(
      "nombreCliente"
    );


  const codigo =
    document.getElementById(
      "codigoResultado"
    );


  const puntos =
    document.getElementById(
      "cantidadPuntos"
    );


  if (nombre) {

    nombre.textContent =
      datos.cliente ||
      "Cliente";

  }


  if (codigo) {

    codigo.textContent =
      datos.codigoCliente ||
      "-";

  }


  if (puntos) {

    puntos.textContent =
      Number(
        datos.puntos
      ) || 0;

  }

}


// ==========================================================
// CARGAR PREMIOS DEL CLIENTE
// ==========================================================

async function cargarPremiosCliente(
  codigo,
  pin,
  puntosCliente
) {

  const contenedor =
    document.getElementById(
      "premiosLista"
    );


  if (!contenedor) {

    return;

  }


  contenedor.innerHTML =
    `
      <div class="premio-card">
        <div class="premio-icon">⏳</div>
        <h3>Cargando premios...</h3>
        <p>Estamos consultando tus beneficios.</p>
      </div>
    `;


  try {

    const parametros =
      new URLSearchParams();


    parametros.append(
      "accion",
      "premiosDisponibles"
    );


    parametros.append(
      "codigo",
      codigo
    );


    parametros.append(
      "pin",
      pin
    );


    const url =
      URL_APPS_SCRIPT +
      "?" +
      parametros.toString();


    const respuesta =
      await fetch(
        url,
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    if (!respuesta.ok) {

      throw new Error(
        "No se pudieron consultar los premios."
      );

    }


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    console.log(
      "🎁 Premios:",
      datos
    );


    if (
      !datos ||
      !datos.correcto
    ) {

      throw new Error(
        datos &&
        datos.mensaje
          ? datos.mensaje
          : "No se pudieron cargar los premios."
      );

    }


    const disponibles =
      Array.isArray(
        datos.disponibles
      )
        ? datos.disponibles
        : [];


    const bloqueados =
      Array.isArray(
        datos.bloqueados
      )
        ? datos.bloqueados
        : [];


    mostrarPremios(
      disponibles,
      bloqueados,
      puntosCliente
    );


  } catch (error) {

    console.error(
      "❌ Error cargando premios:",
      error
    );


    contenedor.innerHTML =
      `
        <div class="premio-card">
          <div class="premio-icon">🎁</div>
          <h3>Premios</h3>
          <p>
            No se pudieron cargar los premios en este momento.
          </p>
        </div>
      `;

  }

}


// ==========================================================
// MOSTRAR PREMIOS
// ==========================================================

function mostrarPremios(
  disponibles,
  bloqueados,
  puntosCliente
) {

  const contenedor =
    document.getElementById(
      "premiosLista"
    );


  if (!contenedor) {

    return;

  }


  contenedor.innerHTML =
    "";


  // ========================================================
  // PREMIOS DISPONIBLES
  // ========================================================

  disponibles.forEach(
    function (premio) {

      const tarjeta =
        crearTarjetaPremio(
          premio,
          true,
          0
        );


      contenedor.appendChild(
        tarjeta
      );

    }
  );


  // ========================================================
  // PREMIOS BLOQUEADOS
  // ========================================================

  bloqueados.forEach(
    function (premio) {

      const faltan =
        Number(
          premio.puntosFaltantes
        ) ||
        Math.max(
          0,
          Number(
            premio.puntos
          ) -
          Number(
            puntosCliente
          )
        );


      const tarjeta =
        crearTarjetaPremio(
          premio,
          false,
          faltan
        );


      contenedor.appendChild(
        tarjeta
      );

    }
  );


  // ========================================================
  // SI NO HAY PREMIOS
  // ========================================================

  if (
    disponibles.length === 0 &&
    bloqueados.length === 0
  ) {

    contenedor.innerHTML =
      `
        <div class="premio-card">
          <div class="premio-icon">🎁</div>
          <h3>Aún no hay premios</h3>
          <p>
            Sigue acumulando puntos para
            descubrir tus beneficios.
          </p>
        </div>
      `;

  }

}


// ==========================================================
// CREAR TARJETA DE PREMIO
// ==========================================================

function crearTarjetaPremio(
  premio,
  disponible,
  faltan
) {

  const tarjeta =
    document.createElement(
      "article"
    );


  tarjeta.className =
    disponible
      ? "premio-card disponible"
      : "premio-card bloqueado";


  const icono =
    disponible
      ? "🎁"
      : "🔒";


  const nombre =
    escaparHTML(
      premio.nombre ||
      "Premio"
    );


  const descripcion =
    escaparHTML(
      premio.descripcion ||
      ""
    );


  const puntos =
    Number(
      premio.puntos
    ) || 0;


  let estadoHTML =
    "";


  if (disponible) {

    estadoHTML =
      `
        <div class="premio-estado">
          🎉 ¡Premio disponible!
        </div>
      `;

  } else {

    estadoHTML =
      `
        <div class="premio-estado">
          🔒 Te faltan
          ${faltan}
          puntos
        </div>
      `;

  }


  tarjeta.innerHTML =
    `
      <div class="premio-icon">
        ${icono}
      </div>

      <h3>
        ${nombre}
      </h3>

      <div class="premio-puntos">
        ⭐ ${puntos} puntos
      </div>

      <p>
        ${descripcion}
      </p>

      ${estadoHTML}
    `;


  return tarjeta;

}


// ==========================================================
// MOSTRAR HISTORIAL
// ==========================================================

function mostrarHistorial(
  historial
) {

  const contenedor =
    document.getElementById(
      "historialLista"
    );


  if (!contenedor) {

    return;

  }


  contenedor.innerHTML =
    "";


  if (
    !Array.isArray(historial) ||
    historial.length === 0
  ) {

    contenedor.innerHTML =
      `
        <div class="sin-historial">
          📋 Todavía no tienes compras o servicios registrados.
        </div>
      `;

    return;

  }


  historial.forEach(
    function (movimiento) {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "historial-item";


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
          "Movimiento"
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


      const observacionHTML =
        observacion
          ? `
              <small>
                ${observacion}
              </small>
            `
          : "";


      item.innerHTML =
        `
          <div class="historial-concepto">

            <div class="historial-fecha">
              ${fecha}
            </div>

            <strong>
              ${concepto}
            </strong>

            <small>
              ${tipo}
            </small>

            ${observacionHTML}

          </div>


          <div class="historial-monto">

            💰 S/
            ${monto.toFixed(2)}

          </div>


          <div class="historial-puntos">

            ⭐ +
            ${puntos}
            puntos

          </div>

        `;


      contenedor.appendChild(
        item
      );

    }
  );

}


// ==========================================================
// LEER RESPUESTA JSON
// ==========================================================

async function leerRespuestaJSON(
  respuesta
) {

  const texto =
    await respuesta.text();


  if (!texto) {

    throw new Error(
      "El servidor no devolvió información."
    );

  }


  try {

    return JSON.parse(
      texto
    );

  } catch (error) {

    console.error(
      "Respuesta no válida:",
      texto
    );


    throw new Error(
      "El servidor devolvió una respuesta no válida."
    );

  }

}


// ==========================================================
// MOSTRAR MENSAJE
// ==========================================================

function mostrarMensajePuntos(
  texto,
  tipo
) {

  const mensaje =
    document.getElementById(
      "mensajePuntos"
    );


  if (!mensaje) {

    return;

  }


  mensaje.textContent =
    texto;


  mensaje.className =
    "mensaje " +
    (
      tipo === "error"
        ? "error"
        : "exito"
    );


  mensaje.style.display =
    "block";

}


// ==========================================================
// OCULTAR MENSAJE
// ==========================================================

function ocultarMensajePuntos() {

  const mensaje =
    document.getElementById(
      "mensajePuntos"
    );


  if (!mensaje) {

    return;

  }


  mensaje.textContent =
    "";


  mensaje.className =
    "mensaje";


  mensaje.style.display =
    "none";

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escaparHTML(
  texto
) {

  return String(
    texto || ""
  )

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


// ==========================================================
// ==========================================================
// ADMINISTRACIÓN
// ==========================================================
// ==========================================================
//
// ESTA PARTE SOLO SE EJECUTA SI LOS ELEMENTOS EXISTEN.
// NO AFECTA puntos.html.
//
// ==========================================================

function inicializarAdministracion() {

  const btnBuscar =
    document.getElementById(
      "btnBuscarCliente"
    );


  const btnRegistrar =
    document.getElementById(
      "btnRegistrarMovimiento"
    );


  const codigoRegistro =
    document.getElementById(
      "codigoRegistro"
    );


  if (btnBuscar) {

    btnBuscar.addEventListener(
      "click",
      buscarClienteAdministracion
    );

  }


  if (btnRegistrar) {

    btnRegistrar.addEventListener(
      "click",
      registrarMovimientoAdministracion
    );

  }


  if (codigoRegistro) {

    codigoRegistro.addEventListener(
      "keydown",
      function (evento) {

        if (
          evento.key === "Enter"
        ) {

          evento.preventDefault();

          buscarClienteAdministracion();

        }

      }
    );

  }


  console.log(
    "⚙️ Compatibilidad administrativa preparada"
  );

}


// ==========================================================
// BUSCAR CLIENTE EN ADMINISTRACIÓN
// ==========================================================

async function buscarClienteAdministracion() {

  const codigoRegistro =
    document.getElementById(
      "codigoRegistro"
    );


  const nombreRegistro =
    document.getElementById(
      "nombreRegistro"
    );


  const puntosRegistro =
    document.getElementById(
      "puntosRegistro"
    );


  const clienteRegistro =
    document.getElementById(
      "clienteRegistro"
    );


  if (!codigoRegistro) {

    return;

  }


  const codigo =
    codigoRegistro.value
      .trim()
      .toUpperCase();


  if (!codigo) {

    mostrarMensajeAdministracion(
      "❌ Primero escribe el código del cliente.",
      "error"
    );

    return;

  }


  try {

    mostrarMensajeAdministracion(
      "⏳ Buscando cliente...",
      "info"
    );


    const parametros =
      new URLSearchParams();


    parametros.append(
      "accion",
      "consultarPuntos"
    );


    parametros.append(
      "codigo",
      codigo
    );


    // IMPORTANTE:
    //
    // Esta búsqueda administrativa
    // depende de cómo tengas configurado
    // tu panel actual.
    //
    // Si tu panel administra usando
    // código solamente, el Apps Script
    // debe aceptar esa consulta.
    //

    const url =
      URL_APPS_SCRIPT +
      "?" +
      parametros.toString();


    const respuesta =
      await fetch(
        url,
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    if (
      !datos.correcto
    ) {

      throw new Error(
        datos.mensaje ||
        "No se encontró el cliente."
      );

    }


    if (nombreRegistro) {

      nombreRegistro.textContent =
        datos.cliente ||
        "Cliente";

    }


    if (puntosRegistro) {

      puntosRegistro.textContent =
        "⭐ " +
        (
          Number(
            datos.puntos
          ) || 0
        ) +
        " puntos";

    }


    if (clienteRegistro) {

      clienteRegistro.style.display =
        "flex";

    }


    codigoRegistro.value =
      datos.codigoCliente ||
      codigo;


    mostrarMensajeAdministracion(
      "✅ Cliente encontrado correctamente.",
      "exito"
    );


  } catch (error) {

    console.error(
      "Error buscando cliente:",
      error
    );


    if (clienteRegistro) {

      clienteRegistro.style.display =
        "none";

    }


    mostrarMensajeAdministracion(
      "❌ " +
      (
        error.message ||
        "No se pudo buscar el cliente."
      ),
      "error"
    );

  }

}


// ==========================================================
// REGISTRAR MOVIMIENTO ADMINISTRACIÓN
// ==========================================================

async function registrarMovimientoAdministracion() {

  const codigoRegistro =
    document.getElementById(
      "codigoRegistro"
    );


  const tipoRegistro =
    document.getElementById(
      "tipoRegistro"
    );


  const conceptoRegistro =
    document.getElementById(
      "conceptoRegistro"
    );


  const montoRegistro =
    document.getElementById(
      "montoRegistro"
    );


  const observacionRegistro =
    document.getElementById(
      "observacionRegistro"
    );


  const btnRegistrar =
    document.getElementById(
      "btnRegistrarMovimiento"
    );


  if (!codigoRegistro) {

    return;

  }


  const codigo =
    codigoRegistro.value
      .trim()
      .toUpperCase();


  const tipo =
    tipoRegistro
      ? tipoRegistro.value
      : "Servicio";


  const concepto =
    conceptoRegistro
      ? conceptoRegistro.value
      : "Otro";


  const monto =
    montoRegistro
      ? Number(
          montoRegistro.value
        )
      : 0;


  const observacion =
    observacionRegistro
      ? observacionRegistro.value.trim()
      : "";


  if (!codigo) {

    mostrarMensajeAdministracion(
      "❌ Primero escribe el código del cliente.",
      "error"
    );

    return;

  }


  if (
    isNaN(monto) ||
    monto <= 0
  ) {

    mostrarMensajeAdministracion(
      "❌ Ingresa un monto válido mayor que cero.",
      "error"
    );

    return;

  }


  if (btnRegistrar) {

    btnRegistrar.disabled =
      true;

  }


  try {

    mostrarMensajeAdministracion(
      "⏳ Registrando movimiento...",
      "info"
    );


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


    const url =
      URL_APPS_SCRIPT +
      "?" +
      parametros.toString();


    const respuesta =
      await fetch(
        url,
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    if (
      !datos.correcto
    ) {

      throw new Error(
        datos.mensaje ||
        "No se pudo registrar el movimiento."
      );

    }


    mostrarMensajeAdministracion(
      "✅ Movimiento registrado correctamente. +" +
      (
        Number(
          datos.puntosGanados
        ) || 0
      ) +
      " puntos.",
      "exito"
    );


    // ======================================================
    // ACTUALIZAR PUNTOS EN ADMINISTRACIÓN
    // ======================================================

    const puntosRegistro =
      document.getElementById(
        "puntosRegistro"
      );


    if (puntosRegistro) {

      puntosRegistro.textContent =
        "⭐ " +
        (
          Number(
            datos.puntosTotales
          ) || 0
        ) +
        " puntos";

    }


    // ======================================================
    // LIMPIAR CAMPOS
    // ======================================================

    if (montoRegistro) {

      montoRegistro.value =
        "";

    }


    if (observacionRegistro) {

      observacionRegistro.value =
        "";

    }


  } catch (error) {

    console.error(
      "Error registrando movimiento:",
      error
    );


    mostrarMensajeAdministracion(
      "❌ " +
      (
        error.message ||
        "No se pudo registrar el movimiento."
      ),
      "error"
    );


  } finally {

    if (btnRegistrar) {

      btnRegistrar.disabled =
        false;

    }

  }

}


// ==========================================================
// MENSAJE ADMINISTRACIÓN
// ==========================================================

function mostrarMensajeAdministracion(
  texto,
  tipo
) {

  const mensaje =
    document.getElementById(
      "mensajeAdmin"
    );


  if (!mensaje) {

    console.log(
      texto
    );

    return;

  }


  mensaje.textContent =
    texto;


  mensaje.style.display =
    "block";


  if (
    tipo === "error"
  ) {

    mensaje.style.color =
      "#c62828";

  }

  else if (
    tipo === "info"
  ) {

    mensaje.style.color =
      "#777";

  }

  else {

    mensaje.style.color =
      "#2e7d32";

  }

}


// ==========================================================
// FIN SCRIPT.JS
// ==========================================================

console.log(
  "✅ Juanita Pacasmayo - sistema web listo."
);
