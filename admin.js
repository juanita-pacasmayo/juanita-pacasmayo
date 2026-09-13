// ==========================================================
// JUANITA PACASMAYO
// ADMIN.JS
// SISTEMA DE ADMINISTRACIÓN
// ==========================================================


// ==========================================================
// URL DE GOOGLE APPS SCRIPT
// ==========================================================

const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// ==========================================================
// ELEMENTOS - MOVIMIENTOS
// ==========================================================

const codigoRegistro =
  document.getElementById(
    "codigoRegistro"
  );

const btnBuscarCliente =
  document.getElementById(
    "btnBuscarCliente"
  );

const clienteRegistro =
  document.getElementById(
    "clienteRegistro"
  );

const nombreRegistro =
  document.getElementById(
    "nombreRegistro"
  );

const puntosRegistro =
  document.getElementById(
    "puntosRegistro"
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

const btnRegistrarMovimiento =
  document.getElementById(
    "btnRegistrarMovimiento"
  );

const mensajeRegistro =
  document.getElementById(
    "mensajeRegistro"
  );

const resultadoRegistro =
  document.getElementById(
    "resultadoRegistro"
  );

const detalleRegistro =
  document.getElementById(
    "detalleRegistro"
  );


// ==========================================================
// WHATSAPP - MOVIMIENTO
// ==========================================================

const btnWhatsAppMovimiento =
  document.getElementById(
    "btnWhatsAppMovimiento"
  );


// Teléfono del cliente actualmente seleccionado

let telefonoMovimiento = "";


// ==========================================================
// ELEMENTOS - CLIENTE
// ==========================================================

const nombreCliente =
  document.getElementById(
    "nombreCliente"
  );

const telefonoCliente =
  document.getElementById(
    "telefonoCliente"
  );

const pinCliente =
  document.getElementById(
    "pinCliente"
  );

const estadoCliente =
  document.getElementById(
    "estadoCliente"
  );

const btnRegistrarCliente =
  document.getElementById(
    "btnRegistrarCliente"
  );

const mensajeCliente =
  document.getElementById(
    "mensajeCliente"
  );

const resultadoCliente =
  document.getElementById(
    "resultadoCliente"
  );

const detalleCliente =
  document.getElementById(
    "detalleCliente"
  );

const btnWhatsAppCliente =
  document.getElementById(
    "btnWhatsAppCliente"
  );


// ==========================================================
// ELEMENTOS - HISTORIAL
// ==========================================================

const historialRegistro =
  document.getElementById(
    "historialRegistro"
  );

const historialBody =
  document.getElementById(
    "historialBody"
  );

const historialVacio =
  document.getElementById(
    "historialVacio"
  );

const totalMovimientos =
  document.getElementById(
    "totalMovimientos"
  );


// ==========================================================
// MOSTRAR MENSAJE DE MOVIMIENTO
// ==========================================================

function mostrarMensaje(
  mensaje,
  tipo = "info"
) {

  if (!mensajeRegistro) {
    return;
  }

  mensajeRegistro.textContent =
    mensaje;

  mensajeRegistro.className =
    "mensaje-registro " +
    tipo;

}


// ==========================================================
// MOSTRAR MENSAJE DE CLIENTE
// ==========================================================

function mostrarMensajeCliente(
  mensaje,
  tipo = "info"
) {

  if (!mensajeCliente) {
    return;
  }

  mensajeCliente.textContent =
    mensaje;

  mensajeCliente.className =
    "mensaje-registro " +
    tipo;

}


// ==========================================================
// LEER JSON
// ==========================================================

async function leerRespuestaJSON(
  respuesta
) {

  const texto =
    await respuesta.text();

  console.log(
    "Respuesta del servidor:",
    texto
  );

  if (
    !texto ||
    !texto.trim()
  ) {

    throw new Error(
      "El servidor no devolvió ninguna respuesta."
    );

  }

  if (
    texto.trim().startsWith("<")
  ) {

    throw new Error(
      "Apps Script devolvió HTML en lugar de JSON. Verifica la URL /exec de la Web App."
    );

  }

  try {

    return JSON.parse(
      texto
    );

  } catch (error) {

    console.error(
      "JSON inválido:",
      texto
    );

    throw new Error(
      "La respuesta de Apps Script no es un JSON válido."
    );

  }

}


// ==========================================================
// CREAR URL
// ==========================================================

function crearURL(
  parametros
) {

  return (
    URL_APPS_SCRIPT +
    "?" +
    parametros.toString()
  );

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escaparHTML(
  texto
) {

  return String(
    texto ?? ""
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
// FORMATEAR MONTO
// ==========================================================

function formatearMonto(
  monto
) {

  return (
    "S/ " +
    Number(
      monto || 0
    ).toFixed(2)
  );

}


// ==========================================================
// BUSCAR CLIENTE
// ==========================================================

async function buscarCliente() {

  if (!codigoRegistro) {
    return;
  }

  const codigo =
    codigoRegistro.value
      .trim()
      .toUpperCase();

  if (!codigo) {

    mostrarMensaje(
      "❌ Escribe el código del cliente.",
      "error"
    );

    codigoRegistro.focus();

    return;

  }

  mostrarMensaje(
    "🔎 Buscando cliente...",
    "info"
  );

  if (clienteRegistro) {

    clienteRegistro.style.display =
      "none";

  }

  if (resultadoRegistro) {

    resultadoRegistro.style.display =
      "none";

  }

  // Ocultar botón WhatsApp hasta encontrar cliente

  if (btnWhatsAppMovimiento) {

    btnWhatsAppMovimiento.style.display =
      "none";

    btnWhatsAppMovimiento.href =
      "#";

  }


  try {

    const parametros =
      new URLSearchParams();

    parametros.append(
      "accion",
      "historialcliente"
    );

    parametros.append(
      "codigo",
      codigo
    );

    const urlPrueba = crearURL(parametros);

console.log("URL que se está consultando:");
console.log(urlPrueba);

const respuesta = await fetch(urlPrueba);

console.log("Estado HTTP:", respuesta.status);
console.log("Respuesta OK:", respuesta.ok);

    const datos =
      await leerRespuestaJSON(
        respuesta
      );

    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se encontró el cliente."
      );

    }


    // ======================================================
    // DATOS DEL CLIENTE
    // ======================================================

    if (nombreRegistro) {

      nombreRegistro.textContent =
        datos.cliente;

    }


    if (puntosRegistro) {

      puntosRegistro.textContent =
        "⭐ " +
        Number(
          datos.puntos || 0
        ) +
        " puntos";

    }


    // ======================================================
    // GUARDAR TELÉFONO
    // ======================================================

    telefonoMovimiento =
      datos.telefono ||
      datos.clienteTelefono ||
      "";


    if (clienteRegistro) {

      clienteRegistro.style.display =
        "flex";

    }


    codigoRegistro.value =
      datos.codigoCliente ||
      codigo;


    mostrarMensaje(
      "✅ Cliente encontrado correctamente.",
      "exito"
    );


    await cargarHistorial(
      datos.codigoCliente ||
      codigo
    );


  } catch (error) {

    console.error(
      error
    );

    telefonoMovimiento =
      "";

    if (clienteRegistro) {

      clienteRegistro.style.display =
        "none";

    }

    mostrarMensaje(
      "❌ " +
      error.message,
      "error"
    );

  }

}


// ==========================================================
// REGISTRAR MOVIMIENTO
// ==========================================================

async function registrarMovimiento() {

  const codigo =
    codigoRegistro
      ? codigoRegistro.value
          .trim()
          .toUpperCase()
      : "";


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


  // ========================================================
  // VALIDAR CÓDIGO
  // ========================================================

  if (!codigo) {

    mostrarMensaje(
      "❌ Primero escribe el código del cliente.",
      "error"
    );

    return;

  }


  // ========================================================
  // VALIDAR MONTO
  // ========================================================

  if (
    isNaN(monto) ||
    monto <= 0
  ) {

    mostrarMensaje(
      "❌ Ingresa un monto válido mayor que cero.",
      "error"
    );

    return;

  }


  mostrarMensaje(
    "⏳ Registrando movimiento...",
    "info"
  );


  if (btnRegistrarMovimiento) {

    btnRegistrarMovimiento.disabled =
      true;

  }


  try {

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


    const respuesta =
      await fetch(
        crearURL(
          parametros
        ),
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo registrar el movimiento."
      );

    }


    // ======================================================
    // MOSTRAR RESULTADO
    // ======================================================

    if (resultadoRegistro) {

      resultadoRegistro.style.display =
        "block";

    }


    if (detalleRegistro) {

      detalleRegistro.innerHTML =

        "<strong>" +
        escaparHTML(
          datos.cliente
        ) +
        "</strong>" +

        "<br><br>" +

        "Código: " +
        escaparHTML(
          datos.codigoCliente
        ) +

        "<br>" +

        "💰 Monto: <strong>" +
        formatearMonto(
          datos.monto
        ) +
        "</strong>" +

        "<br>" +

        "⭐ Puntos ganados: <strong>" +
        Number(
          datos.puntosGanados || 0
        ) +
        "</strong>" +

        "<br>" +

        "⭐ Puntos acumulados: <strong>" +
        Number(
          datos.puntosTotales || 0
        ) +
        "</strong>";

    }


    // ======================================================
    // CREAR BOTÓN WHATSAPP DEL MOVIMIENTO
    // ======================================================

    if (btnWhatsAppMovimiento) {

      const enlaceWhatsAppMovimiento =
        crearEnlaceWhatsAppMovimiento(

          telefonoMovimiento ||
          datos.telefono ||
          datos.clienteTelefono ||
          "",

          datos.cliente ||
          "",

          datos.codigoCliente ||
          codigo,

          concepto,

          datos.monto ||
          monto,

          datos.puntosGanados ||
          0,

          datos.puntosTotales ||
          0

        );


      if (
        enlaceWhatsAppMovimiento
      ) {

        btnWhatsAppMovimiento.href =
          enlaceWhatsAppMovimiento;

        btnWhatsAppMovimiento.target =
          "_blank";

        btnWhatsAppMovimiento.rel =
          "noopener noreferrer";

        btnWhatsAppMovimiento.style.display =
          "inline-flex";

      } else {

        btnWhatsAppMovimiento.style.display =
          "none";

        console.warn(
          "No se pudo crear el enlace de WhatsApp porque no existe teléfono del cliente."
        );

      }

    }


    // ======================================================
    // MENSAJE DE ÉXITO
    // ======================================================

    mostrarMensaje(
      "✅ Compra / servicio registrado correctamente.",
      "exito"
    );


    // ======================================================
    // ACTUALIZAR CLIENTE
    // ======================================================

    if (nombreRegistro) {

      nombreRegistro.textContent =
        datos.cliente;

    }


    if (puntosRegistro) {

      puntosRegistro.textContent =
        "⭐ " +
        Number(
          datos.puntosTotales || 0
        ) +
        " puntos";

    }


    if (clienteRegistro) {

      clienteRegistro.style.display =
        "flex";

    }


    // ======================================================
    // LIMPIAR MONTO
    // ======================================================

    if (montoRegistro) {

      montoRegistro.value =
        "";

    }


    // ======================================================
    // LIMPIAR OBSERVACIÓN
    // ======================================================

    if (observacionRegistro) {

      observacionRegistro.value =
        "";

    }


    // ======================================================
    // RECARGAR HISTORIAL
    // ======================================================

    await cargarHistorial(
      datos.codigoCliente
    );


    // ======================================================
    // BAJAR HASTA EL HISTORIAL
    // ======================================================

    if (historialRegistro) {

      historialRegistro.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }


  } catch (error) {

    console.error(
      error
    );

    mostrarMensaje(
      "❌ " +
      error.message,
      "error"
    );


  } finally {

    if (btnRegistrarMovimiento) {

      btnRegistrarMovimiento.disabled =
        false;

    }

  }

}


// ==========================================================
// GENERAR ENLACE WHATSAPP - MOVIMIENTO
// ==========================================================

function crearEnlaceWhatsAppMovimiento(
  telefono,
  nombre,
  codigo,
  tipo,
  concepto,
  monto,
  puntosGanados,
  puntosTotales
) {

  let numero = String(telefono || "").replace(/\D/g, "");

  if (!numero) {
    return "";
  }

  // ========================================================
  // PERÚ
  // ========================================================

  if (numero.length === 9) {
    numero = "51" + numero;
  }

  // ========================================================
  // ENLACE DE CONSULTA
  // ========================================================

  const enlaceConsulta =
    "https://juanita-pacasmayo.github.io/juanita-pacasmayo/consulta.html";

  // ========================================================
  // MENSAJE
  // ========================================================

  const mensaje =
    "Hola " +
    nombre +
    " 👋\n\n" +

    "✨ Se ha registrado un nuevo movimiento en tu cuenta de puntos de Juanita Pacasmayo.\n\n" +

    "📋 Detalle del movimiento:\n\n" +

    "📝 Concepto: " +
    concepto +
    "\n" +

    "💰 Monto: S/ " +
    Number(monto || 0).toFixed(2) +
    "\n" +

    "⭐ Puntos ganados: " +
    puntosGanados +
    "\n\n" +

    "🌟 Puntos acumulados: " +
    puntosTotales +
    "\n\n" +

    "🌐 Consulta tus puntos y premios aquí:\n" +
    enlaceConsulta +
    "\n\n" +

    "Ingresa tu código de cliente y PIN para consultar toda tu información.\n\n" +

    "¡Gracias por elegir Juanita Pacasmayo! 💕";

  return (
    "https://wa.me/" +
    numero +
    "?text=" +
    encodeURIComponent(mensaje)
  );
}



// ==========================================================
// REGISTRAR CLIENTE
// ==========================================================

async function registrarCliente() {

  const nombre =
    nombreCliente
      ? nombreCliente.value.trim()
      : "";


  const telefono =
    telefonoCliente
      ? telefonoCliente.value.trim()
      : "";


  const pin =
    pinCliente
      ? pinCliente.value.trim()
      : "";


  const estado =
    estadoCliente
      ? estadoCliente.value
      : "Activo";


  // ========================================================
  // VALIDACIONES
  // ========================================================

  if (!nombre) {

    mostrarMensajeCliente(
      "❌ Ingresa el nombre completo del cliente.",
      "error"
    );

    if (nombreCliente) {
      nombreCliente.focus();
    }

    return;

  }


  if (!telefono) {

    mostrarMensajeCliente(
      "❌ Ingresa el número de teléfono.",
      "error"
    );

    if (telefonoCliente) {
      telefonoCliente.focus();
    }

    return;

  }


  // Solo números

  if (
    !/^\d+$/.test(
      telefono
    )
  ) {

    mostrarMensajeCliente(
      "❌ El teléfono debe contener solamente números.",
      "error"
    );

    if (telefonoCliente) {
      telefonoCliente.focus();
    }

    return;

  }


  if (!pin) {

    mostrarMensajeCliente(
      "❌ Ingresa un PIN para el cliente.",
      "error"
    );

    if (pinCliente) {
      pinCliente.focus();
    }

    return;

  }


  if (
    !/^\d+$/.test(
      pin
    )
  ) {

    mostrarMensajeCliente(
      "❌ El PIN debe contener solamente números.",
      "error"
    );

    if (pinCliente) {
      pinCliente.focus();
    }

    return;

  }


  // ========================================================
  // ESTADO
  // ========================================================

  mostrarMensajeCliente(
    "⏳ Registrando cliente...",
    "info"
  );


  if (btnRegistrarCliente) {

    btnRegistrarCliente.disabled =
      true;

  }


  try {

    const parametros =
      new URLSearchParams();


    parametros.append(
      "accion",
      "registrarCliente"
    );


    parametros.append(
      "nombre",
      nombre
    );


    parametros.append(
      "telefono",
      telefono
    );


    parametros.append(
      "pin",
      pin
    );


    parametros.append(
      "estado",
      estado
    );


    const respuesta =
      await fetch(
        crearURL(
          parametros
        ),
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    console.log(
      "Respuesta registrar cliente:",
      datos
    );


    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo registrar el cliente."
      );

    }


    // ======================================================
    // MOSTRAR ÉXITO
    // ======================================================

    mostrarMensajeCliente(
      "✅ Cliente registrado correctamente.",
      "exito"
    );


    if (resultadoCliente) {

      resultadoCliente.style.display =
        "block";

    }


    if (detalleCliente) {

      detalleCliente.innerHTML =

        "<div class='cliente-exito-datos'>" +

          "<p>" +

            "<span>👤 Cliente</span>" +

            "<strong>" +

              escaparHTML(
                datos.nombre ||
                nombre
              ) +

            "</strong>" +

          "</p>" +

          "<p>" +

            "<span>🆔 Código</span>" +

            "<strong class='codigo-generado'>" +

              escaparHTML(
                datos.codigoCliente ||
                ""
              ) +

            "</strong>" +

          "</p>" +

          "<p>" +

            "<span>🔐 PIN</span>" +

            "<strong>" +

              escaparHTML(
                datos.pin ||
                pin
              ) +

            "</strong>" +

          "</p>" +

      
        "</div>";

    }


    // ======================================================
    // WHATSAPP CLIENTE
    // ======================================================

    if (
      btnWhatsAppCliente
    ) {

      const enlaceWhatsApp =
        crearEnlaceWhatsApp(

          datos.telefono ||
          telefono,

          datos.nombre ||
          nombre,

          datos.codigoCliente ||
          "",

          datos.pin ||
          pin

        );


      if (
        enlaceWhatsApp
      ) {

        btnWhatsAppCliente.href =
          enlaceWhatsApp;

        btnWhatsAppCliente.target =
          "_blank";

        btnWhatsAppCliente.rel =
          "noopener noreferrer";

        btnWhatsAppCliente.style.display =
          "inline-flex";

      } else {

        btnWhatsAppCliente.style.display =
          "none";

      }

    }


    // ======================================================
    // COLOCAR CÓDIGO EN REGISTRO DE MOVIMIENTOS
    // ======================================================

    if (
      datos.codigoCliente &&
      codigoRegistro
    ) {

      codigoRegistro.value =
        datos.codigoCliente;


      // Guardar teléfono para WhatsApp

      telefonoMovimiento =
        datos.telefono ||
        telefono;


      if (nombreRegistro) {

        nombreRegistro.textContent =
          datos.nombre ||
          nombre;

      }


      if (puntosRegistro) {

        puntosRegistro.textContent =
          "⭐ 0 puntos";

      }


      if (clienteRegistro) {

        clienteRegistro.style.display =
          "flex";

      }


      await cargarHistorial(
        datos.codigoCliente
      );

    }


    // ======================================================
    // LIMPIAR FORMULARIO
    // ======================================================

    if (nombreCliente) {

      nombreCliente.value =
        "";

    }


    if (telefonoCliente) {

      telefonoCliente.value =
        "";

    }


    if (pinCliente) {

      pinCliente.value =
        "";

    }


  } catch (error) {

    console.error(
      "Error registrando cliente:",
      error
    );


    mostrarMensajeCliente(
      "❌ " +
      error.message,
      "error"
    );


  } finally {

    if (btnRegistrarCliente) {

      btnRegistrarCliente.disabled =
        false;

    }

  }

}


// ==========================================================
// GENERAR ENLACE WHATSAPP - CLIENTE
// ==========================================================

function crearEnlaceWhatsApp(
  telefono,
  nombre,
  codigo,
  pin
) {

  let numero =
    String(
      telefono || ""
    )
      .replace(
        /\D/g,
        ""
      );


  if (!numero) {

    return "";

  }


  // ========================================================
  // PERÚ
  // ========================================================

  if (
    numero.length === 9
  ) {

    numero =
      "51" +
      numero;

  }


  // ========================================================
  // ENLACE PARA CONSULTAR PUNTOS
  // ========================================================

  const enlaceConsulta =
    "https://juanita-pacasmayo.github.io/juanita-pacasmayo/consulta.html";


  // ========================================================
  // MENSAJE DE WHATSAPP
  // ========================================================

  const mensaje =

    "Hola " +
    nombre +
    " 👋\n\n" +

    "Bienvenido(a) al programa de puntos de Juanita Pacasmayo 💖\n\n" +

    "Estos son tus datos:\n\n" +

    "🆔 Código de cliente: " +
    codigo +
    "\n" +

    "🔐 PIN: " +
    pin +
    "\n\n" +

    "🌐 Consulta tus puntos y premios aquí:\n" +

    enlaceConsulta +
    "\n\n" +

    "Ingresa tu código de cliente y PIN para consultar tus puntos y premios.\n\n" +

    "Guarda tu código y PIN para futuras consultas.\n\n" +

    "¡Gracias por elegir Juanita Pacasmayo! 🌸";


  return (
    "https://wa.me/" +
    numero +
    "?text=" +
    encodeURIComponent(
      mensaje
    )
  );

}


// ==========================================================
// CARGAR HISTORIAL
// ==========================================================

async function cargarHistorial(
  codigo
) {

  if (
    !codigo
  ) {

    return;

  }


  if (
    !historialRegistro &&
    !historialBody
  ) {

    return;

  }


  if (historialRegistro) {

    historialRegistro.style.display =
      "block";

  }


  if (historialBody) {

    historialBody.innerHTML =

      "<div class='historial-cargando'>" +

        "⏳ Consultando historial..." +

      "</div>";

  }


  try {

    const parametros =
      new URLSearchParams();


    parametros.append(
      "accion",
      "historialCliente"
    );


    parametros.append(
      "codigo",
      codigo
    );


    const respuesta =
      await fetch(
        crearURL(
          parametros
        ),
        {
          method: "GET",
          cache: "no-cache"
        }
      );


    const datos =
      await leerRespuestaJSON(
        respuesta
      );


    if (!datos.correcto) {

      throw new Error(
        datos.mensaje ||
        "No se pudo cargar el historial."
      );

    }


    mostrarHistorial(
      datos
    );


  } catch (error) {

    console.error(
      "Error historial:",
      error
    );


    if (historialBody) {

      historialBody.innerHTML =

        "<div class='historial-vacio'>" +

          "⚠️ No se pudo cargar el historial.<br><br>" +

          escaparHTML(
            error.message
          ) +

        "</div>";

    }

  }

}


// ==========================================================
// MOSTRAR HISTORIAL
// ==========================================================

function mostrarHistorial(
  datos
) {

  if (!historialBody) {

    return;

  }


  const historial =
    Array.isArray(
      datos.historial
    )
      ? datos.historial
      : [];


  actualizarTotalMovimientos(
    historial.length
  );


  if (
    historialVacio
  ) {

    historialVacio.style.display =
      "none";

  }


  if (
    historial.length === 0
  ) {

    historialBody.innerHTML =

      "<div class='historial-vacio'>" +

        "<div>" +
          "📋" +
        "</div>" +

        "<strong>" +
          "Este cliente todavía no tiene movimientos." +
        "</strong>" +

        "<p>" +
          "Aquí aparecerán sus compras y servicios registrados." +
        "</p>" +

      "</div>";


    return;

  }


  let html = "";


  historial.forEach(
    function(movimiento) {


      const tipo =
        movimiento.tipo ||
        "Movimiento";


      const concepto =
        movimiento.concepto ||
        "Sin concepto";


      const fecha =
        movimiento.fecha ||
        "-";


      const monto =
        Number(
          movimiento.monto || 0
        );


      const puntos =
        Number(
          movimiento.puntos || 0
        );


      const observacion =
        movimiento.observacion ||
        "";


      let icono =
        "🧾";


      if (
        String(
          tipo
        )
          .toLowerCase()
          .includes(
            "servicio"
          )
      ) {

        icono =
          "✨";

      }


      if (
        String(
          concepto
        )
          .toLowerCase()
          .includes(
            "laceado"
          )
      ) {

        icono =
          "💇";

      }

      else if (
        String(
          concepto
        )
          .toLowerCase()
          .includes(
            "uñas"
          )
      ) {

        icono =
          "💅";

      }

      else if (
        String(
          concepto
        )
          .toLowerCase()
          .includes(
            "pestañas"
          )
      ) {

        icono =
          "👁️";

      }

      else if (
        String(
          concepto
        )
          .toLowerCase()
          .includes(
            "producto"
          )
      ) {

        icono =
          "🛍️";

      }


      html +=

        "<div class='historial-item'>" +

          "<div class='historial-icono'>" +

            icono +

          "</div>" +


          "<div class='historial-info'>" +

            "<strong>" +

              escaparHTML(
                concepto
              ) +

            "</strong>" +

            "<span>" +

              escaparHTML(
                tipo
              ) +

            "</span>" +

            "<small>" +

              "📅 " +

              escaparHTML(
                fecha
              ) +

            "</small>" +

            (

              observacion

                ? "<small>" +
                    escaparHTML(
                      observacion
                    ) +
                  "</small>"

                : ""

            ) +

          "</div>" +


          "<div class='historial-monto'>" +

            "<strong>" +

              formatearMonto(
                monto
              ) +

            "</strong>" +

            "<span>" +

              "⭐ +" +
              puntos +
              " puntos" +

            "</span>" +

          "</div>" +

        "</div>";

    }
  );


  historialBody.innerHTML =
    html;

}


// ==========================================================
// ACTUALIZAR TOTAL
// ==========================================================

function actualizarTotalMovimientos(
  cantidad
) {

  if (
    !totalMovimientos
  ) {

    return;

  }


  totalMovimientos.textContent =

    cantidad +

    (
      cantidad === 1
        ? " movimiento"
        : " movimientos"
    );

}


// ==========================================================
// BOTÓN BUSCAR
// ==========================================================

if (
  btnBuscarCliente
) {

  btnBuscarCliente.addEventListener(
    "click",
    buscarCliente
  );

}


// ==========================================================
// BOTÓN REGISTRAR MOVIMIENTO
// ==========================================================

if (
  btnRegistrarMovimiento
) {

  btnRegistrarMovimiento.addEventListener(
    "click",
    registrarMovimiento
  );

}


// ==========================================================
// BOTÓN REGISTRAR CLIENTE
// ==========================================================

if (
  btnRegistrarCliente
) {

  btnRegistrarCliente.addEventListener(
    "click",
    registrarCliente
  );

}


// ==========================================================
// ENTER EN CÓDIGO
// ==========================================================

if (
  codigoRegistro
) {

  codigoRegistro.addEventListener(
    "keydown",
    function(evento) {

      if (
        evento.key === "Enter"
      ) {

        evento.preventDefault();

        buscarCliente();

      }

    }
  );

}


// ==========================================================
// SOLO NÚMEROS EN TELÉFONO
// ==========================================================

if (
  telefonoCliente
) {

  telefonoCliente.addEventListener(
    "input",
    function() {

      this.value =
        this.value.replace(
          /\D/g,
          ""
        );

    }
  );

}


// ==========================================================
// SOLO NÚMEROS EN PIN
// ==========================================================

if (
  pinCliente
) {

  pinCliente.addEventListener(
    "input",
    function() {

      this.value =
        this.value.replace(
          /\D/g,
          ""
        );

    }
  );

}


// ==========================================================
// MAYÚSCULAS EN CÓDIGO
// ==========================================================

if (
  codigoRegistro
) {

  codigoRegistro.addEventListener(
    "input",
    function() {

      this.value =
        this.value.toUpperCase();

    }
  );

}


// ==========================================================
// INICIO
// ==========================================================

console.log(
  "=========================================="
);

console.log(
  "✅ admin.js cargado correctamente"
);

console.log(
  "✅ Registrar cliente: OK"
);

console.log(
  "✅ WhatsApp cliente: OK"
);

console.log(
  "✅ WhatsApp movimiento: OK"
);

console.log(
  "✅ Movimientos: OK"
);

console.log(
  "✅ Historial: OK"
);

console.log(
  "=========================================="
);
