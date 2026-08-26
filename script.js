// =====================================================
// JUANITA PACASMAYO - CONSULTA DE PUNTOS
// =====================================================

// URL DE TU WEB APP DE GOOGLE APPS SCRIPT
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbxZW06LP3ctRtIZXBBlo3paILCjcBjQVDMCuOLmNnqU4BuZpbMz3b8jh82V8ZNki1U/exec";


// =====================================================
// CONSULTAR PUNTOS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const btnConsultarPuntos = document.getElementById("btnConsultarPuntos");
    const codigoCliente = document.getElementById("codigoCliente");

    const mensajePuntos = document.getElementById("mensajePuntos");
    const resultadoPuntos = document.getElementById("resultadoPuntos");

    const nombreCliente = document.getElementById("nombreCliente");
    const cantidadPuntos = document.getElementById("cantidadPuntos");


    // Verificar que el botón exista
    if (!btnConsultarPuntos) {
        console.error("No se encontró el botón btnConsultarPuntos");
        return;
    }


    // =================================================
    // EVENTO DEL BOTÓN
    // =================================================

    btnConsultarPuntos.addEventListener("click", async function () {

        const codigo = codigoCliente.value.trim();


        // Limpiar mensajes anteriores
        if (mensajePuntos) {
            mensajePuntos.textContent = "";
            mensajePuntos.style.display = "none";
        }

        if (resultadoPuntos) {
            resultadoPuntos.style.display = "none";
        }


        // =================================================
        // VALIDAR CÓDIGO
        // =================================================

        if (codigo === "") {

            mostrarMensajePuntos(
                "Por favor, ingresa tu código de cliente.",
                "error"
            );

            return;
        }


        // =================================================
        // MOSTRAR CARGANDO
        // =================================================

        btnConsultarPuntos.disabled = true;
        btnConsultarPuntos.textContent = "Consultando...";


        try {

            // Construir URL
            const url =
                URL_APPS_SCRIPT +
                "?accion=consultarPuntos&codigo=" +
                encodeURIComponent(codigo);


            console.log("Consultando puntos:", url);


            // =================================================
            // CONSULTAR APPS SCRIPT
            // =================================================

            const respuesta = await fetch(url);


            if (!respuesta.ok) {
                throw new Error(
                    "Error HTTP: " + respuesta.status
                );
            }


            const datos = await respuesta.json();


            console.log("Respuesta de Apps Script:", datos);


            // =================================================
            // PROCESAR RESPUESTA
            // =================================================

            if (datos.correcto === true) {

                // Nombre
                if (nombreCliente) {
                    nombreCliente.textContent =
                        datos.nombre || "Cliente";
                }


                // Puntos
                if (cantidadPuntos) {
                    cantidadPuntos.textContent =
                        datos.puntos ?? 0;
                }


                // Mostrar resultado
                if (resultadoPuntos) {
                    resultadoPuntos.style.display = "block";
                }


                mostrarMensajePuntos(
                    datos.mensaje ||
                    "Consulta realizada correctamente.",
                    "exito"
                );


            } else {

                mostrarMensajePuntos(
                    datos.mensaje ||
                    "No se encontró información para este código.",
                    "error"
                );

            }


        } catch (error) {

            console.error(
                "Error al consultar puntos:",
                error
            );


            mostrarMensajePuntos(
                "No se pudo realizar la consulta. Intenta nuevamente.",
                "error"
            );


        } finally {

            // Restaurar botón
            btnConsultarPuntos.disabled = false;
            btnConsultarPuntos.textContent =
                "Consultar mis puntos";

        }

    });

});


// =====================================================
// MOSTRAR MENSAJES
// =====================================================

function mostrarMensajePuntos(texto, tipo) {

    const mensaje = document.getElementById("mensajePuntos");

    if (!mensaje) {
        return;
    }


    mensaje.textContent = texto;
    mensaje.style.display = "block";


    if (tipo === "error") {

        mensaje.style.color = "#c62828";

    } else {

        mensaje.style.color = "#2e7d32";

    }

}
