const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
    menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navLinks.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
      menuButton.focus();
    }
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Formulario de contacto desplegable y selector Persona / Empresa.
const contactTrigger = document.querySelector("#contact-trigger");
const contactFormWrap = document.querySelector("#contact-form-wrap");
const contactForm = document.querySelector("#contact-form");
const contactTypeInput = document.querySelector("#contact-type");
const formFeedback = document.querySelector("#form-feedback");
const formClose = document.querySelector(".form-close");
const typeButtons = document.querySelectorAll("[data-contact-type]");

function setContactType(type) {
  contactTypeInput.value = type;
  typeButtons.forEach((button) => {
    const active = button.dataset.contactType === type;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll(".company-only").forEach((field) => {
    const visible = type === "empresa";
    field.hidden = !visible;
    const input = field.querySelector("input");
    input.required = field.dataset.field === "empresa" && visible;
  });

  const nameLabel = document.querySelector('[data-field="nombre"] span');
  const nameInput = document.querySelector('[data-field="nombre"] input');
  nameLabel.textContent = type === "empresa" ? "Nombre de la persona de contacto *" : "Nombre completo *";
  nameInput.placeholder = type === "empresa" ? "Nombre de quien nos contacta" : "Tu nombre y apellido";
  formFeedback.textContent = "";
}

if (contactTrigger && contactFormWrap) {
  contactTrigger.addEventListener("click", () => {
    const opening = contactFormWrap.hidden;
    contactFormWrap.hidden = !opening;
    contactTrigger.setAttribute("aria-expanded", String(opening));
    contactTrigger.querySelector("span").textContent = opening ? "−" : "↗";
    if (opening) contactFormWrap.querySelector("input:not([type=hidden])").focus();
  });
}

typeButtons.forEach((button) => {
  button.addEventListener("click", () => setContactType(button.dataset.contactType));
});

if (formClose) {
  formClose.addEventListener("click", () => {
    contactFormWrap.hidden = true;
    contactTrigger.setAttribute("aria-expanded", "false");
    contactTrigger.querySelector("span").textContent = "↗";
    contactTrigger.focus();
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const type = formData.get("tipo") === "empresa" ? "Empresa" : "Persona";
    const details = Array.from(formData.entries())
      .filter(([key, value]) => value && key !== "tipo")
      .map(([key, value]) => `${key}: ${value}`)
      .join("\\n");

    formFeedback.textContent = `Formulario validado para ${type}. Esta versión es una demostración: todavía falta conectar un servicio de envío para recibir los datos.`;
    console.info("Consulta de FairBuy preparada (demo):", details);
  });
}

setContactType("persona");
