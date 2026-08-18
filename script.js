const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen);
});
