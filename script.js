const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");

  const abierto = mainNav.classList.contains("open");
  menuToggle.setAttribute("aria-expanded", abierto);
});

document.querySelectorAll(".main-nav a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
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
      throw new Error("HTTP " + response.status);
    }

    return response.json();
  })
  .then(data => {
    console.log("✅ Respuesta de Apps Script:", data);
  })
  .catch(error => {
    console.error("❌ Error conectando con Apps Script:", error);
  });
